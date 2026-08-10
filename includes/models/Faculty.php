<?php
/**
 * Faculty.php — data access for the Faculty Profile Management System
 * (directory at /about/faculty, individual profiles at
 * /about/faculty/{slug}). Same try-Strapi/fall-back-to-empty pattern as
 * every other model in this project (see Gallery.php for the closest
 * precedent — a listing with no fabricated placeholder content).
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

/** Splits a comma-separated tag field ("AI, Robotics, ML") into a clean array. */
function stc_faculty_tags(?string $csv): array
{
    if (!$csv) {
        return [];
    }
    $tags = array_map('trim', explode(',', $csv));
    return array_values(array_filter($tags, static fn ($t) => $t !== ''));
}

function stc_faculty_setting_defaults(): array
{
    return [
        'hero_background'   => null,
        'card_style'        => 'rounded',
        'animation_style'   => 'fade',
        'cards_per_row'     => 3,
        'default_banner'    => null,
        'button_style'      => 'solid',
        'student_count'     => 0,
        'show_statistics'   => true,
        'show_publications' => true,
        'show_awards'       => true,
        'show_gallery'      => true,
        'show_contact'      => true,
        'show_office_hours' => true,
        'show_research'     => true,
    ];
}

function stc_get_faculty_setting(): array
{
    $defaults = stc_faculty_setting_defaults();

    $res = stc_strapi_get('faculty-setting', ['populate' => ['hero_background', 'default_banner']]);
    $row = $res['data'] ?? null;
    if ($row) {
        $row['hero_background'] = stc_strapi_media_url($row['hero_background'] ?? null);
        $row['default_banner'] = stc_strapi_media_url($row['default_banner'] ?? null);
        return array_merge($defaults, array_filter($row, static fn ($v) => $v !== null));
    }

    return $defaults;
}

/** Departments, ordered for nav/filter display. */
function stc_get_departments(): array
{
    $res = stc_strapi_get('departments', [
        'populate' => 'department_logo',
        'sort'     => 'display_order:asc',
        'pagination' => ['pageSize' => 100],
    ]);
    $rows = $res['data'] ?? [];

    return array_map(static function (array $row): array {
        $row['logo_url'] = stc_strapi_media_url($row['department_logo'] ?? null);
        unset($row['department_logo']);
        return $row;
    }, $rows);
}

/** Maps one raw Strapi faculty-profile row into the flat shape views expect. */
function stc_map_faculty_card(array $row): array
{
    return [
        'id'                    => $row['id'],
        'slug'                  => $row['slug'],
        'full_name'             => $row['full_name'],
        'position'              => $row['position'] ?? '',
        'department'            => $row['department']['department_name'] ?? '',
        'department_slug'       => $row['department']['slug'] ?? '',
        'highest_qualification' => $row['highest_qualification'] ?? '',
        'specialization'        => $row['specialization'] ?? '',
        'research_areas'        => stc_faculty_tags($row['research_areas'] ?? null),
        'college_email'         => $row['college_email'] ?? '',
        'linkedin_url'          => $row['linkedin_url'] ?? '',
        'google_scholar_url'    => $row['google_scholar_url'] ?? '',
        'is_featured'           => (bool) ($row['is_featured'] ?? false),
        'profile_picture_url'   => stc_strapi_media_url($row['profile_picture'] ?? null),
    ];
}

/**
 * Card-shaped faculty list for the directory grid, with optional search/filters.
 * @param array{q?:string,department?:string,position?:string,qualification?:string,research_area?:string,featured_only?:bool} $args
 */
function stc_get_faculty_list(array $args = []): array
{
    $filters = [];

    if (!empty($args['q'])) {
        $q = $args['q'];
        $filters['$or'] = [
            ['full_name'      => ['$containsi' => $q]],
            ['position'       => ['$containsi' => $q]],
            ['specialization' => ['$containsi' => $q]],
            ['research_areas' => ['$containsi' => $q]],
        ];
    }
    if (!empty($args['department'])) {
        $filters['department'] = ['slug' => ['$eq' => $args['department']]];
    }
    if (!empty($args['position'])) {
        $filters['position'] = ['$eq' => $args['position']];
    }
    if (!empty($args['qualification'])) {
        $filters['highest_qualification'] = ['$eq' => $args['qualification']];
    }
    if (!empty($args['research_area'])) {
        $filters['research_areas'] = ['$containsi' => $args['research_area']];
    }
    if (!empty($args['featured_only'])) {
        $filters['is_featured'] = ['$eq' => true];
    }

    $res = stc_strapi_get('faculty-profiles', [
        'filters'    => $filters,
        'populate'   => ['profile_picture', 'department'],
        'sort'       => ['sort_order:asc', 'full_name:asc'],
        'pagination' => ['pageSize' => 100],
    ]);
    $rows = $res['data'] ?? [];
    $cards = array_map('stc_map_faculty_card', $rows);

    // Department heads first (is_featured), then everyone else grouped by
    // department (in the admin-configured department display order), each
    // group internally still in sort_order/name order from the query above
    // — PHP's usort is stable since 8.0, so ties keep their query order.
    $deptRank = [];
    foreach (stc_get_departments() as $i => $dept) {
        $deptRank[$dept['slug'] ?? ''] = $i;
    }
    $heads = array_values(array_filter($cards, static fn ($f) => $f['is_featured']));
    $rest = array_values(array_filter($cards, static fn ($f) => !$f['is_featured']));
    usort($rest, static function (array $a, array $b) use ($deptRank): int {
        $rankA = $deptRank[$a['department_slug']] ?? PHP_INT_MAX;
        $rankB = $deptRank[$b['department_slug']] ?? PHP_INT_MAX;
        return $rankA <=> $rankB;
    });

    return array_merge($heads, $rest);
}

/** Full profile for the individual faculty page, or null if not found/unreachable. */
function stc_get_faculty_by_slug(string $slug): ?array
{
    $res = stc_strapi_get('faculty-profiles', [
        'filters'    => ['slug' => ['$eq' => $slug]],
        'populate'   => [
            'profile_picture', 'cover_image', 'department',
            'publications', 'awards',
            'conference_images', 'research_photos', 'department_event_photos', 'workshop_photos',
        ],
        'pagination' => ['pageSize' => 1],
    ]);
    $row = $res['data'][0] ?? null;
    if (!$row) {
        return null;
    }

    $row['profile_picture_url'] = stc_strapi_media_url($row['profile_picture'] ?? null);
    $row['cover_image_url'] = stc_strapi_media_url($row['cover_image'] ?? null);
    $row['department_name'] = $row['department']['department_name'] ?? '';
    $row['department_slug'] = $row['department']['slug'] ?? '';
    $row['research_areas_list'] = stc_faculty_tags($row['research_areas'] ?? null);
    $row['teaching_subjects_list'] = stc_faculty_tags($row['teaching_subjects'] ?? null);
    $row['languages_list'] = stc_faculty_tags($row['languages'] ?? null);

    $row['publications'] = array_map(static function (array $pub): array {
        $pub['pdf_url'] = stc_strapi_media_url($pub['pdf'] ?? null);
        unset($pub['pdf']);
        return $pub;
    }, $row['publications'] ?? []);

    $row['awards'] = array_map(static function (array $award): array {
        $award['certificate_url'] = stc_strapi_media_url($award['certificate'] ?? null);
        unset($award['certificate']);
        return $award;
    }, $row['awards'] ?? []);

    foreach (['conference_images', 'research_photos', 'department_event_photos', 'workshop_photos'] as $galleryField) {
        $row[$galleryField] = array_map(
            static fn (array $img) => stc_strapi_media_url($img),
            $row[$galleryField] ?? []
        );
    }

    unset($row['profile_picture'], $row['cover_image'], $row['department']);

    return $row;
}

/**
 * Distinct filter options for the search/filter bar, computed from the
 * faculty list itself (dataset is small enough that this is cheap, and
 * it avoids a separate lookup collection just for facet values).
 */
function stc_get_faculty_filter_options(): array
{
    $res = stc_strapi_get('faculty-profiles', [
        'fields'     => ['position', 'highest_qualification', 'research_areas'],
        'pagination' => ['pageSize' => 200],
    ]);
    $rows = $res['data'] ?? [];

    $positions = [];
    $qualifications = [];
    $researchAreas = [];

    foreach ($rows as $row) {
        if (!empty($row['position'])) {
            $positions[$row['position']] = true;
        }
        if (!empty($row['highest_qualification'])) {
            $qualifications[$row['highest_qualification']] = true;
        }
        foreach (stc_faculty_tags($row['research_areas'] ?? null) as $tag) {
            $researchAreas[$tag] = true;
        }
    }

    return [
        'departments'    => stc_get_departments(),
        'positions'      => array_keys($positions),
        'qualifications' => array_keys($qualifications),
        'research_areas' => array_keys($researchAreas),
    ];
}

/** Counts for the animated stats row. Falls back to 0 for anything unreachable. */
function stc_get_faculty_stats(): array
{
    $facultyCount = 0;
    $departmentCount = 0;
    $researchCount = 0;

    $res = stc_strapi_get('faculty-profiles', ['pagination' => ['pageSize' => 1]]);
    $facultyCount = (int) ($res['meta']['pagination']['total'] ?? 0);

    $res = stc_strapi_get('departments', ['pagination' => ['pageSize' => 1]]);
    $departmentCount = (int) ($res['meta']['pagination']['total'] ?? 0);

    $res = stc_strapi_get('research-publications', ['pagination' => ['pageSize' => 1]]);
    $researchCount = (int) ($res['meta']['pagination']['total'] ?? 0);

    $settings = stc_get_faculty_setting();

    return [
        'faculty_count'    => $facultyCount,
        'department_count' => $departmentCount,
        'research_count'   => $researchCount,
        'student_count'    => (int) $settings['student_count'],
    ];
}
