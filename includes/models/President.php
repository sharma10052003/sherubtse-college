<?php
/**
 * President.php — data access for the President's Welcome section.
 * The fallback is deliberately generic/instructional rather than a
 * fabricated name, quote, or photo — inventing a real person's
 * identity would be actively misleading, unlike generic marketing
 * copy elsewhere on the site.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

function stc_get_president_content(): array
{
    $defaults = [
        'name'           => '',
        'position'       => 'Office of the President',
        'message'        => "A welcome message from the President will appear here once it's added from the admin panel.",
        'photo_path'     => null,
        'signature_path' => null,
        'button_text'    => 'Read Full Message',
        'button_url'     => '/about/president',
    ];

    $res = stc_strapi_get('president-content', ['populate' => ['photo', 'signature']]);
    $row = $res['data'] ?? null;
    if ($row) {
        $row['photo_path'] = stc_strapi_media_url($row['photo'] ?? null);
        $row['signature_path'] = stc_strapi_media_url($row['signature'] ?? null);
        unset($row['photo'], $row['signature']);
        return array_merge($defaults, array_filter($row, static fn ($v) => $v !== null && $v !== ''));
    }

    return $defaults;
}
