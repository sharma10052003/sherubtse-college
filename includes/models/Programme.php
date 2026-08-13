<?php
/**
 * Programme.php — data access for the Programmes catalogue (/programmes)
 * and detail template (/programmes/{slug}). Same try-Strapi/fall-back
 * pattern as every other model in this project — mirrors Faculty.php's
 * shape (query/list/by-slug) since the catalogue UI is modeled directly
 * on the faculty directory.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

/** Maps one raw Strapi programme row into the flat shape catalogue cards expect. */
function stc_map_programme_card(array $row): array
{
    return [
        'id'                => $row['id'],
        'slug'              => $row['slug'],
        'programme_name'    => $row['programme_name'],
        'level'             => $row['level'] ?? '',
        'degree_type'       => $row['degree_type'] ?? '',
        'duration'          => $row['duration'] ?? '',
        'short_description' => $row['short_description'] ?? '',
        'department'        => $row['department']['department_name'] ?? '',
        'department_slug'   => $row['department']['slug'] ?? '',
        'hero_image_url'    => stc_strapi_media_url($row['hero_image'] ?? null),
    ];
}

/**
 * Runs the filtered programmes query and returns flat, card-shaped rows.
 * @param array{q?:string,department?:string,level?:string} $args
 */
function stc_query_programme_cards(array $args = []): array
{
    $filters = [];

    if (!empty($args['q'])) {
        $q = $args['q'];
        $filters['$or'] = [
            ['programme_name'    => ['$containsi' => $q]],
            ['short_description' => ['$containsi' => $q]],
            ['degree_type'       => ['$containsi' => $q]],
        ];
    }
    if (!empty($args['department'])) {
        $filters['department'] = ['slug' => ['$eq' => $args['department']]];
    }
    if (!empty($args['level'])) {
        $filters['level'] = ['$eq' => $args['level']];
    }

    $res = stc_strapi_get('programmes', [
        'filters'    => $filters,
        'fields'     => ['programme_name', 'slug', 'level', 'degree_type', 'duration', 'short_description'],
        'populate'   => ['hero_image', 'department'],
        'sort'       => ['display_order:asc', 'programme_name:asc'],
        'pagination' => ['pageSize' => 100],
    ]);
    $rows = $res['data'] ?? [];

    return array_map('stc_map_programme_card', $rows);
}

/** Card-shaped programme list for the catalogue grid. */
function stc_get_programme_list(array $args = []): array
{
    return stc_query_programme_cards($args);
}

/** Full programme record for the detail page, or null if not found/unreachable. */
function stc_get_programme_by_slug(string $slug): ?array
{
    $res = stc_strapi_get('programmes', [
        'filters'    => ['slug' => ['$eq' => $slug]],
        'populate'   => ['hero_image', 'department', 'curriculum', 'faqs'],
        'pagination' => ['pageSize' => 1],
    ]);
    $row = $res['data'][0] ?? null;
    if (!$row) {
        return null;
    }

    $row['hero_image_url'] = stc_strapi_media_url($row['hero_image'] ?? null);
    $row['department_name'] = $row['department']['department_name'] ?? '';
    $row['department_slug'] = $row['department']['slug'] ?? '';
    $row['curriculum'] = $row['curriculum'] ?? [];
    $row['faqs'] = $row['faqs'] ?? [];

    unset($row['hero_image'], $row['department']);

    return $row;
}

/** Up to $limit other programmes from the same department, excluding the current one. */
function stc_get_related_programmes(string $departmentSlug, string $excludeSlug, int $limit = 3): array
{
    if ($departmentSlug === '') {
        return [];
    }

    $res = stc_strapi_get('programmes', [
        'filters' => [
            'department' => ['slug' => ['$eq' => $departmentSlug]],
            'slug'       => ['$ne' => $excludeSlug],
        ],
        'fields'     => ['programme_name', 'slug', 'level', 'degree_type', 'duration', 'short_description'],
        'populate'   => ['hero_image', 'department'],
        'sort'       => ['display_order:asc', 'programme_name:asc'],
        'pagination' => ['pageSize' => $limit],
    ]);
    $rows = $res['data'] ?? [];

    return array_map('stc_map_programme_card', $rows);
}

/** Distinct filter facets (departments + levels) for the catalogue's filter bar. */
function stc_get_programme_filter_options(): array
{
    require_once __DIR__ . '/Faculty.php';

    return [
        'departments' => stc_get_departments(),
        'levels'      => ['undergraduate' => 'Undergraduate', 'postgraduate' => 'Postgraduate'],
    ];
}
