<?php
/**
 * admin/sections/theme.php — global Design & Theme editor.
 * Every value here maps 1:1 to a --stc-* CSS custom property override
 * rendered by includes/theme.php, so a save here re-themes the entire
 * public site instantly — no code change, no redeploy.
 */
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../../includes/models/Settings.php';

$s = stc_theme_settings();

function stc_color_field(string $key, string $label, array $s): void
{
    $val = htmlspecialchars($s[$key], ENT_QUOTES, 'UTF-8');
    echo '<div class="stc-admin-field"><label for="f_' . $key . '">' . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . '</label>'
       . '<div class="stc-admin-color-row">'
       . '<input type="color" id="f_' . $key . '" data-pair="' . $key . '" value="' . $val . '">'
       . '<input type="text" data-pair-text="' . $key . '" name="' . $key . '" value="' . $val . '" maxlength="7" pattern="^#[0-9A-Fa-f]{6}$">'
       . '</div></div>';
}

$pageTitle = 'Design & Theme';
$activeSection = 'theme';
require __DIR__ . '/../includes/layout-head.php';
?>

<form id="stcThemeForm" class="stc-admin-layout" novalidate>
  <?php echo stc_csrf_field(); ?>
  <div>
    <div class="stc-admin-panel">
      <h2>Brand Colors</h2>
      <div class="stc-admin-grid-2">
        <?php
          stc_color_field('color_primary', 'Primary', $s);
          stc_color_field('color_secondary', 'Secondary', $s);
          stc_color_field('color_accent', 'Accent', $s);
          stc_color_field('color_accent_light', 'Accent (light / hover)', $s);
          stc_color_field('color_hover', 'Hover / focus ring', $s);
        ?>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>Backgrounds, Cards & Text</h2>
      <div class="stc-admin-grid-2">
        <?php
          stc_color_field('color_background', 'Page background', $s);
          stc_color_field('color_background_alt', 'Alt background', $s);
          stc_color_field('color_card', 'Card background', $s);
          stc_color_field('color_border', 'Border', $s);
          stc_color_field('color_text', 'Text', $s);
          stc_color_field('color_text_soft', 'Secondary text', $s);
          stc_color_field('color_button_text', 'Button text', $s);
        ?>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>Gradient & Hero Overlay</h2>
      <div class="stc-admin-grid-2">
        <?php
          stc_color_field('gradient_start', 'Gradient start', $s);
          stc_color_field('gradient_end', 'Gradient end', $s);
          stc_color_field('hero_overlay_color', 'Hero overlay color', $s);
        ?>
        <div class="stc-admin-field">
          <label for="f_hero_overlay_opacity">Hero overlay opacity — <span id="overlayOpacityOut"><?php echo (int) $s['hero_overlay_opacity']; ?></span>%</label>
          <input type="range" id="f_hero_overlay_opacity" name="hero_overlay_opacity" min="0" max="90" value="<?php echo (int) $s['hero_overlay_opacity']; ?>">
        </div>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>Dark Mode Colors</h2>
      <div class="stc-admin-grid-2">
        <?php
          stc_color_field('dark_background', 'Dark background', $s);
          stc_color_field('dark_background_alt', 'Dark alt background', $s);
          stc_color_field('dark_card', 'Dark card', $s);
          stc_color_field('dark_text', 'Dark text', $s);
          stc_color_field('dark_text_soft', 'Dark secondary text', $s);
        ?>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>Typography</h2>
      <div class="stc-admin-grid-2">
        <div class="stc-admin-field">
          <label for="f_font_heading">Heading font</label>
          <select id="f_font_heading" name="font_heading">
            <?php foreach (['Fraunces', 'Playfair Display', 'Merriweather', 'Georgia'] as $f): ?>
              <option value="<?php echo $f; ?>" <?php echo $s['font_heading'] === $f ? 'selected' : ''; ?>><?php echo $f; ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="stc-admin-field">
          <label for="f_font_body">Body font</label>
          <select id="f_font_body" name="font_body">
            <?php foreach (['Public Sans', 'Inter', 'Source Sans 3', 'Arial'] as $f): ?>
              <option value="<?php echo $f; ?>" <?php echo $s['font_body'] === $f ? 'selected' : ''; ?>><?php echo $f; ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>Layout & Motion</h2>
      <div class="stc-admin-grid-2">
        <div class="stc-admin-field">
          <label for="f_radius_card">Card corner radius (px)</label>
          <input type="number" id="f_radius_card" name="radius_card" min="0" max="40" value="<?php echo (int) $s['radius_card']; ?>">
        </div>
        <div class="stc-admin-field">
          <label for="f_radius_button">Button corner radius (px)</label>
          <input type="number" id="f_radius_button" name="radius_button" min="0" max="40" value="<?php echo (int) $s['radius_button']; ?>">
        </div>
        <div class="stc-admin-field">
          <label for="f_shadow_style">Shadow style</label>
          <select id="f_shadow_style" name="shadow_style">
            <?php foreach (['soft' => 'Soft', 'medium' => 'Medium', 'hard' => 'Hard (crisp offset)'] as $val => $label): ?>
              <option value="<?php echo $val; ?>" <?php echo $s['shadow_style'] === $val ? 'selected' : ''; ?>><?php echo $label; ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="stc-admin-field">
          <label for="f_animation_speed">Animation speed</label>
          <select id="f_animation_speed" name="animation_speed">
            <?php foreach (['slow' => 'Slow', 'normal' => 'Normal', 'fast' => 'Fast'] as $val => $label): ?>
              <option value="<?php echo $val; ?>" <?php echo $s['animation_speed'] === $val ? 'selected' : ''; ?>><?php echo $label; ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="stc-admin-field">
          <label for="f_animations_enabled">
            <input type="checkbox" id="f_animations_enabled" name="animations_enabled" value="1" <?php echo ($s['animations_enabled'] ?? '1') !== '0' ? 'checked' : ''; ?> style="width:auto; margin-right:0.5rem;">
            Enable homepage animations
          </label>
          <span class="stc-admin-hint">Turns off all scroll-reveal, hover and transition effects sitewide when unchecked.</span>
        </div>
        <div class="stc-admin-field">
          <label for="f_container_width">Container max width (px)</label>
          <input type="number" id="f_container_width" name="container_width" min="960" max="1920" step="10" value="<?php echo (int) $s['container_width']; ?>">
        </div>
        <div class="stc-admin-field">
          <label for="f_spacing_scale">Spacing scale</label>
          <select id="f_spacing_scale" name="spacing_scale">
            <?php foreach (['compact' => 'Compact', 'comfortable' => 'Comfortable', 'spacious' => 'Spacious'] as $val => $label): ?>
              <option value="<?php echo $val; ?>" <?php echo $s['spacing_scale'] === $val ? 'selected' : ''; ?>><?php echo $label; ?></option>
            <?php endforeach; ?>
          </select>
        </div>
      </div>
    </div>

    <div class="stc-admin-form-actions">
      <button type="submit" class="stc-admin-btn stc-admin-btn--primary"><i class="bi bi-save" aria-hidden="true"></i> Save theme</button>
      <span class="stc-admin-hint">Applies to the public homepage immediately after saving.</span>
    </div>
  </div>

  <aside class="stc-admin-preview">
    <p class="stc-admin-preview__label">Live preview</p>
    <div class="stc-theme-preview" id="themePreview">
      <div class="stc-theme-preview__swatches" id="previewSwatches"></div>
      <div class="stc-theme-preview__card" id="previewCard">
        <h3 id="previewCardTitle">Sample Heading</h3>
        <p>This is how body copy and secondary text will look across the homepage.</p>
        <span class="stc-theme-preview__btn" id="previewCardBtn">Sample Button</span>
      </div>
    </div>
  </aside>
</form>

<link rel="stylesheet" href="<?php echo BASE_URL; ?>admin/assets/css/theme-editor.css">
<script>window.STC_THEME_SAVE_URL = <?php echo json_encode(BASE_URL . 'admin/ajax/theme-save.php'); ?>;</script>
<script src="<?php echo BASE_URL; ?>admin/assets/js/theme-editor.js" defer></script>

<?php require __DIR__ . '/../includes/layout-foot.php'; ?>
