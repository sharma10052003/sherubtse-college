<?php
/**
 * History.php — data access for the History & Heritage standalone
 * page (/about/history). Same try/fall-back shape as every other
 * model in this project; the seeded defaults here are the real
 * historical facts supplied by the college, not placeholder copy —
 * the one exception is imagery nobody has provided yet (Father
 * Mackey's photo, hero background, then/now photos), which stays an
 * honest placeholder rather than a fabricated image.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

function stc_history_gallery_categories(): array
{
    return [
        'campus'       => 'Campus',
        'students'     => 'First Students',
        'construction' => 'Construction',
        'events'       => 'Events',
        'festivals'    => 'Festivals',
        'graduation'   => 'Graduation',
    ];
}

function stc_get_history_content(): array
{
    $defaults = [
        'hero_title'        => 'History & Heritage',
        'hero_subtitle'     => 'Sherubtse College — The Peak of Learning',
        'hero_intro'        => 'The story of Bhutan\'s oldest tertiary institution will appear here once added from the admin panel.',
        'hero_image_path'   => null,
        'hero_image_position' => 'top',
        'founding_story'    => 'The founding story will appear here once added from the admin panel.',
        'vision_king_text'  => 'This section will appear here once added from the admin panel.',
        'king_photo_path'   => null,
        'mackey_name'       => 'Father William Mackey',
        'mackey_photo_path' => null,
        'mackey_bio'        => "The founding principal's biography will appear here once added from the admin panel.",
        'motto'             => 'Education for Excellence',
        'motto_meaning'     => null,
        'emblem_meaning'    => null,
        'values_text'       => null,
        'video_url'         => null,
        'brochure_path'     => null,
        'then_image_path'   => null,
        'now_image_path'    => null,
    ];

    $res = stc_strapi_get('history-contents', [
        'populate' => ['hero_image', 'king_photo', 'mackey_photo', 'brochure', 'then_image', 'now_image'],
    ]);
    $row = $res['data'] ?? null;
    if ($row) {
        $row['hero_image_path'] = stc_strapi_media_url($row['hero_image'] ?? null);
        $row['king_photo_path'] = stc_strapi_media_url($row['king_photo'] ?? null);
        $row['mackey_photo_path'] = stc_strapi_media_url($row['mackey_photo'] ?? null);
        $row['brochure_path'] = stc_strapi_media_url($row['brochure'] ?? null);
        $row['then_image_path'] = stc_strapi_media_url($row['then_image'] ?? null);
        $row['now_image_path'] = stc_strapi_media_url($row['now_image'] ?? null);
        unset($row['hero_image'], $row['king_photo'], $row['mackey_photo'], $row['brochure'], $row['then_image'], $row['now_image']);
        return array_merge($defaults, array_filter($row, static fn ($v) => $v !== null && $v !== ''));
    }

    return $defaults;
}

function stc_get_history_timeline(): array
{
    $res = stc_strapi_get('history-timeline-items', ['sort' => 'sort_order:asc']);
    return $res['data'] ?? [];
}

function stc_get_history_legacy_items(): array
{
    $res = stc_strapi_get('history-legacy-items', ['sort' => 'sort_order:asc']);
    return $res['data'] ?? [];
}

function stc_get_history_tradition_items(): array
{
    $res = stc_strapi_get('history-tradition-items', ['sort' => 'sort_order:asc']);
    return $res['data'] ?? [];
}

function stc_get_history_gallery_images(): array
{
    $res = stc_strapi_get('history-gallery-images', [
        'populate' => 'image',
        'sort'     => 'sort_order:asc',
    ]);
    $rows = $res['data'] ?? [];

    return array_map(static function (array $row): array {
        $row['image_path'] = stc_strapi_media_url($row['image'] ?? null);
        unset($row['image']);
        return $row;
    }, $rows);
}
