<?php
/**
 * Department.php — data access for a single department's landing page
 * (/about/faculty/department/{slug}). Same try-Strapi/fall-back pattern
 * as every other model in this project. The department *list* (for the
 * faculty directory filter) stays in Faculty.php's stc_get_departments()
 * — this file is just the single-department hero/detail lookup.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

/** Full department record for the department hero page, or null if not found/unreachable. */
function stc_get_department_by_slug(string $slug): ?array
{
    $res = stc_strapi_get('departments', [
        'filters'    => ['slug' => ['$eq' => $slug]],
        'populate'   => ['department_logo', 'banner_image', 'hero_video', 'mobile_background', 'head_of_department'],
        'pagination' => ['pageSize' => 1],
    ]);
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
