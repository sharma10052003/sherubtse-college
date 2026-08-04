<?php
/**
 * Gallery.php — data access for the Campus Gallery homepage section.
 * Unlike Hero/other sections, this deliberately has NO text/icon
 * fallback content: a photo gallery with no real photos should not
 * render placeholder imagery. stc_get_gallery_images() returns an
 * empty array when there are no rows, and the homepage section
 * checks for that and renders nothing in that case.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

function stc_gallery_categories(): array
{
    return [
        'campus'    => 'Campus',
        'academics' => 'Academics',
        'events'    => 'Events',
        'sports'    => 'Sports',
        'culture'   => 'Culture',
    ];
}

function stc_get_gallery_content(): array
{
    $defaults = [
        'title'    => 'Campus Gallery',
        'subtitle' => 'A glimpse of life at Sherubtse College — campus, classrooms, events and everything in between.',
    ];

    $res = stc_strapi_get('gallery-contents');
    $row = $res['data'] ?? null;
    if ($row) {
        return array_merge($defaults, array_filter($row, static fn ($v) => $v !== null && $v !== ''));
    }

    return $defaults;
}

function stc_get_gallery_images(): array
{
    $res = stc_strapi_get('gallery-images', [
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
