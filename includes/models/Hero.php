<?php
/**
 * Hero.php — data access for the Hero Section.
 * -----------------------------------------------------------------------
 * Every function falls back to realistic default content if Strapi is
 * unreachable or has no data yet, so the public homepage never breaks —
 * it just renders as if the admin hadn't customised it yet.
 * -----------------------------------------------------------------------
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

function stc_hero_defaults(): array
{
    return [
        'title'           => 'The Seat of Learning in the Eastern Himalayas',
        'subtitle'        => 'Founded in 1968, Sherubtse College is the oldest tertiary institution in Bhutan — a constituent college of the Royal University of Bhutan shaping scholars, leaders and innovators from its hillside campus in Kanglung.',
        'cta1_text'       => 'Apply Now',
        'cta1_url'        => '/admissions/apply',
        'cta2_text'       => 'Explore Programmes',
        'cta2_url'        => '/programmes',
        'background_type' => 'gradient',
        'media_path'      => null,
        'overlay_style'   => 'maroon',
        'overlay_opacity' => 55,
    ];
}

function stc_get_hero_content(): array
{
    $defaults = stc_hero_defaults();

    $res = stc_strapi_get('hero-content', ['populate' => 'media']);
    $row = $res['data'] ?? null;
    if ($row) {
        $row['media_path'] = stc_strapi_media_url($row['media'] ?? null);
        unset($row['media']);
        return array_merge($defaults, array_filter($row, static fn ($v) => $v !== null));
    }

    return $defaults;
}

/**
 * @param string $type 'stat' or 'badge'
 */
function stc_get_hero_items(string $type): array
{
    $fallback = [
        'stat' => [
            ['icon' => 'bi-hourglass-split', 'value' => '58',   'suffix' => '+', 'label' => 'Years of Excellence'],
            ['icon' => 'bi-mortarboard',     'value' => '5000', 'suffix' => '+', 'label' => 'Students Enrolled'],
            ['icon' => 'bi-globe2',          'value' => '12',   'suffix' => '+', 'label' => 'Countries Represented'],
        ],
        'badge' => [
            ['icon' => 'bi-patch-check-fill', 'value' => null, 'suffix' => null, 'label' => 'RUB Constituent College'],
            ['icon' => 'bi-award-fill',       'value' => null, 'suffix' => null, 'label' => "Bhutan's First College"],
        ],
    ];

    $res = stc_strapi_get('hero-items', [
        'filters' => ['item_type' => ['$eq' => $type]],
        'sort'    => 'sort_order:asc',
    ]);
    $rows = $res['data'] ?? null;
    if ($rows) {
        return $rows;
    }

    return $fallback[$type] ?? [];
}
