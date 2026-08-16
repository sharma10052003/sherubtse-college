<?php
/**
 * Contact.php — data access for the Contact Us directory (/contact).
 * Same try-Strapi/fall-back pattern as every other model in this
 * project. stc_get_contact_people() returns a flat, ordered list of
 * contact-person rows for the directory grid — who's in it is
 * entirely admin-defined, nothing here is hardcoded.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

function stc_get_contact_page_content(): array
{
    $defaults = [
        'hero_eyebrow'   => 'Get in Touch',
        'hero_title'     => 'Contact Us',
        'hero_subtitle'  => "Reach the right office directly — every contact below is kept up to date from the admin panel.",
        'office_hours'   => '',
        'general_email'  => '',
        'general_phone'  => '',
        'map_url'        => '',
    ];

    $res = stc_strapi_get('contact-page-content');
    $row = $res['data'] ?? null;
    if ($row) {
        return array_merge($defaults, array_filter($row, static fn ($v) => $v !== null && $v !== ''));
    }

    return $defaults;
}

/** Maps one raw Strapi contact-person row into the flat shape views expect. */
function stc_map_contact_person(array $row): array
{
    return [
        'id'              => $row['id'],
        'full_name'       => $row['full_name'] ?? '',
        'role_title'      => $row['role_title'] ?? '',
        'group_title'     => $row['group_title'] ?? 'General',
        'group_icon'      => $row['group_icon'] ?? '',
        'group_order'     => (int) ($row['group_order'] ?? 0),
        'display_order'   => (int) ($row['display_order'] ?? 0),
        'email'           => $row['email'] ?? '',
        'phone'           => $row['phone'] ?? '',
        'office_location' => $row['office_location'] ?? '',
        'bio'             => $row['bio'] ?? '',
        'photo_url'       => stc_strapi_media_url($row['photo'] ?? null),
    ];
}

/**
 * Flat, ordered contact directory for the grid — sorted by
 * group_order/display_order/full_name so admin-controlled ordering is
 * still respected even without any grouped/tabbed UI.
 * @return array<int, array>
 */
function stc_get_contact_people(): array
{
    $res = stc_strapi_get('contact-people', [
        'populate'   => ['photo'],
        'sort'       => ['group_order:asc', 'display_order:asc', 'full_name:asc'],
        'pagination' => ['pageSize' => 200],
    ]);
    $rows = $res['data'] ?? [];

    return array_map('stc_map_contact_person', $rows);
}
