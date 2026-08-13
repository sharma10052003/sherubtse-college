<?php
/**
 * Department.php — data access for the department directory (/departments)
 * and a single department's landing page (/departments/{slug}). Same
 * try-Strapi/fall-back pattern as every other model in this project. The
 * department list *for the faculty directory filter* stays in Faculty.php's
 * stc_get_departments() — this file covers the department-focused pages.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

/**
 * All departments for the /departments directory grid — name, slug,
 * short description and banner only (no faculty/programme relations).
 */
function stc_get_department_directory(): array
{
    $res = stc_strapi_get('departments', [
        'fields'   => ['department_name', 'slug', 'short_description'],
        'populate' => ['banner_image', 'department_logo'],
        'sort'     => 'display_order:asc',
        'pagination' => ['pageSize' => 100],
    ]);
    $rows = $res['data'] ?? [];

    return array_map(static function (array $row): array {
        $row['banner_image_url'] = stc_strapi_media_url($row['banner_image'] ?? null);
        $row['logo_url'] = stc_strapi_media_url($row['department_logo'] ?? null);
        unset($row['banner_image'], $row['department_logo']);
        return $row;
    }, $rows);
}

/**
 * Lightweight {department_name, slug} pairs for the Academics mega menu.
 * Deliberately requests only these two fields — never touches the
 * `programmes` relation — so the header stays cheap even though every
 * page on the site renders it. Callers should cache this (see
 * stc_get_cached_nav_departments() in navigation.php) rather than call it
 * on every request.
 */
function stc_get_nav_departments(): array
{
    $res = stc_strapi_get('departments', [
        'fields'     => ['department_name', 'slug'],
        'sort'       => 'display_order:asc',
        'pagination' => ['pageSize' => 20],
    ]);
    return $res['data'] ?? [];
}

/** A department's programmes (for its detail page), lightest shape needed for a card. */
function stc_get_department_programmes(string $departmentSlug): array
{
    $res = stc_strapi_get('programmes', [
        'filters'    => ['department' => ['slug' => ['$eq' => $departmentSlug]]],
        'fields'     => ['programme_name', 'slug', 'level', 'degree_type', 'duration', 'short_description'],
        'populate'   => ['hero_image'],
        'sort'       => ['display_order:asc', 'programme_name:asc'],
        'pagination' => ['pageSize' => 100],
    ]);
    $rows = $res['data'] ?? [];

    return array_map(static function (array $row): array {
        $row['hero_image_url'] = stc_strapi_media_url($row['hero_image'] ?? null);
        unset($row['hero_image']);
        return $row;
    }, $rows);
}

/** Full department record for the department hero page, or null if not found/unreachable. */
function stc_get_department_by_slug(string $slug): ?array
{
    $res = stc_strapi_get('departments', [
        'filters'    => ['slug' => ['$eq' => $slug]],
        'populate'   => ['department_logo', 'banner_image', 'hero_video', 'mobile_background', 'head_of_department'],
        'pagination' => ['pageSize' => 1],
    ]);
    // programmes are fetched separately (stc_get_department_programmes) so
    // this hero lookup never pulls in richtext/component fields it doesn't need.
    $row = $res['data'][0] ?? null;
    if (!$row) {
        return null;
    }

    $row['logo_url'] = stc_strapi_media_url($row['department_logo'] ?? null);
    $row['banner_image_url'] = stc_strapi_media_url($row['banner_image'] ?? null);
    $row['hero_video_url'] = stc_strapi_media_url($row['hero_video'] ?? null);
    $row['mobile_background_url'] = stc_strapi_media_url($row['mobile_background'] ?? null);
    $row['head_of_department_name'] = $row['head_of_department']['full_name'] ?? '';
    $row['head_of_department_slug'] = $row['head_of_department']['slug'] ?? '';

    unset($row['department_logo'], $row['banner_image'], $row['hero_video'], $row['mobile_background'], $row['head_of_department']);

    // Sensible defaults for hero settings so a department created before
    // these fields existed (or with them left blank) still renders fine.
    $row['animation_type'] = $row['animation_type'] ?? 'flowing-gradient';
    $row['animation_intensity'] = $row['animation_intensity'] ?? 'medium';
    $row['animation_speed'] = $row['animation_speed'] ?? 'normal';
    $row['overlay_opacity'] = $row['overlay_opacity'] ?? 60;
    $row['animation_enabled'] = $row['animation_enabled'] ?? true;

    return $row;
}
