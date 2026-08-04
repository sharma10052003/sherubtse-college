<?php
/**
 * HomepageSections.php — the registry that drives which homepage
 * sections render, in what order. Read by index.php (public).
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

/**
 * Section keys in the default/fallback order, used only if Strapi is
 * unreachable or has no data — keeps the homepage from going blank if
 * the CMS has a problem.
 */
function stc_homepage_section_fallback_order(): array
{
    return ['hero', 'president', 'vision_mission', 'highlights', 'events', 'news',
        'academics', 'statistics', 'campus_life', 'research', 'gallery',
        'partners', 'testimonials', 'cta'];
}

/**
 * Section keys that are enabled and within their publish window
 * (if scheduled), in display order. Used by index.php to decide
 * which includes/homepage/{key}.php files to render.
 */
function stc_get_enabled_sections(): array
{
    $now = gmdate('Y-m-d\TH:i:s.000\Z');

    $res = stc_strapi_get('homepage-sections', [
        'filters' => [
            'is_enabled' => ['$eq' => true],
            '$and' => [
                ['$or' => [
                    ['publish_at' => ['$null' => true]],
                    ['publish_at' => ['$lte' => $now]],
                ]],
                ['$or' => [
                    ['unpublish_at' => ['$null' => true]],
                    ['unpublish_at' => ['$gt' => $now]],
                ]],
            ],
        ],
        'sort' => 'sort_order:asc',
        'pagination' => ['pageSize' => 100],
    ]);
    $rows = $res['data'] ?? null;
    if ($rows) {
        return array_column($rows, 'section_key');
    }

    return stc_homepage_section_fallback_order();
}

/** Every registry row (admin use — includes disabled/scheduled sections). */
function stc_get_all_sections(): array
{
    $res = stc_strapi_get('homepage-sections', [
        'sort' => 'sort_order:asc',
        'pagination' => ['pageSize' => 100],
    ]);
    return $res['data'] ?? [];
}
