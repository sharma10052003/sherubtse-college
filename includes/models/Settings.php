<?php
/**
 * Settings.php — data access for the theme design-token single type.
 * Shared by the public includes/theme.php (renders CSS overrides).
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

function stc_settings_defaults(): array
{
    return [
        'color_primary'        => '#7A1B2B',
        'color_secondary'      => '#4E1019',
        'color_accent'         => '#C7962C',
        'color_accent_light'   => '#E8C97A',
        'color_background'     => '#FAF7F1',
        'color_background_alt' => '#F3EEE4',
        'color_card'           => '#FFFFFF',
        'color_text'           => '#221A17',
        'color_text_soft'      => '#5B4E48',
        'color_border'         => '#E4DCD1',
        'color_button_text'    => '#FFFFFF',
        'color_hover'          => '#E8C97A',
        'gradient_start'       => '#7A1B2B',
        'gradient_end'         => '#C7962C',
        'hero_overlay_color'   => '#221A17',
        'hero_overlay_opacity' => '55',
        'dark_background'      => '#1B1412',
        'dark_background_alt'  => '#241A17',
        'dark_card'             => '#241A17',
        'dark_text'             => '#F3EEE4',
        'dark_text_soft'        => '#C9BCB3',
        'font_heading'          => 'Fraunces',
        'font_body'             => 'Public Sans',
        'radius_card'           => '18',
        'radius_button'         => '10',
        'shadow_style'          => 'soft',
        'animation_speed'       => 'normal',
        'animations_enabled'    => '1',
        'container_width'       => '1240',
        'spacing_scale'         => 'comfortable',
    ];
}

/** [key => value], merged over defaults so a missing/new key is never blank. */
function stc_theme_settings(): array
{
    static $settings = null;
    if ($settings !== null) {
        return $settings;
    }

    $defaults = stc_settings_defaults();

    $res = stc_strapi_get('theme-setting');
    $row = $res['data'] ?? null;
    if ($row) {
        if (array_key_exists('animations_enabled', $row)) {
            $row['animations_enabled'] = $row['animations_enabled'] ? '1' : '0';
        }
        $defaults = array_merge($defaults, array_filter($row, static fn ($v) => $v !== null && $v !== ''));
    }

    $settings = $defaults;
    return $settings;
}

/** #rrggbb -> "r, g, b" for building rgba() strings. */
function stc_hex_to_rgb_triplet(string $hex): string
{
    $hex = ltrim($hex, '#');
    if (strlen($hex) === 3) {
        $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
    }
    if (strlen($hex) !== 6 || !ctype_xdigit($hex)) {
        return '0, 0, 0';
    }
    return implode(', ', [
        hexdec(substr($hex, 0, 2)),
        hexdec(substr($hex, 2, 2)),
        hexdec(substr($hex, 4, 2)),
    ]);
}
