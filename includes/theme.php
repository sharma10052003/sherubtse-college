<?php
/**
 * theme.php — dynamic design-token layer.
 * -----------------------------------------------------------------------
 * Reads `site_settings` and prints a single <style> block that overrides
 * the --stc-* custom properties variables.css defines on :root. Include
 * this AFTER header.php so it lands after variables.css in source order
 * and wins the cascade — header.php itself is never touched.
 *
 * Every value has a hard-coded fallback matching the current
 * variables.css palette, so a missing table/row/DB outage never breaks
 * the page — it just renders with the original static theme.
 * -----------------------------------------------------------------------
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/models/Settings.php';

$s = stc_theme_settings();
$ink = stc_hex_to_rgb_triplet($s['color_text']);

$shadowSets = [
    'soft'   => ['sm' => "0 1px 2px rgba($ink,0.08)",  'md' => "0 8px 24px rgba($ink,0.12)",  'lg' => "0 20px 48px rgba($ink,0.18)"],
    'medium' => ['sm' => "0 2px 4px rgba($ink,0.10)",  'md' => "0 12px 32px rgba($ink,0.16)", 'lg' => "0 28px 60px rgba($ink,0.22)"],
    'hard'   => ['sm' => "2px 2px 0 rgba($ink,0.85)",  'md' => "6px 6px 0 rgba($ink,0.8)",    'lg' => "10px 10px 0 rgba($ink,0.75)"],
];
$shadows = $shadowSets[$s['shadow_style']] ?? $shadowSets['soft'];

$animationsEnabled = ($s['animations_enabled'] ?? '1') !== '0';

$speedFactors = ['slow' => 1.6, 'normal' => 1.0, 'fast' => 0.6];
$speedFactor = $animationsEnabled ? ($speedFactors[$s['animation_speed']] ?? 1.0) : 0;
$durFast = round(150 * $speedFactor);
$durBase = round(240 * $speedFactor);
$durSlow = round(420 * $speedFactor);

$spacingFactors = ['compact' => 0.8, 'comfortable' => 1.0, 'spacious' => 1.25];
$spacingFactor = $spacingFactors[$s['spacing_scale']] ?? 1.0;
$spaceBase = [1 => 0.25, 2 => 0.5, 3 => 0.75, 4 => 1, 5 => 1.5, 6 => 2, 7 => 3, 8 => 4];

$heroOverlayRgb = stc_hex_to_rgb_triplet($s['hero_overlay_color']);
$heroOverlayAlpha = max(0, min(100, (int) $s['hero_overlay_opacity'])) / 100;
?>
<style id="stc-theme-overrides">
:root {
  --stc-maroon: <?php echo htmlspecialchars($s['color_primary'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-maroon-dark: <?php echo htmlspecialchars($s['color_secondary'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-maroon-tint: <?php echo htmlspecialchars($s['color_background_alt'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-gold: <?php echo htmlspecialchars($s['color_accent'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-gold-light: <?php echo htmlspecialchars($s['color_accent_light'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-paper: <?php echo htmlspecialchars($s['color_background'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-paper-alt: <?php echo htmlspecialchars($s['color_background_alt'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-ink: <?php echo htmlspecialchars($s['color_text'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-ink-soft: <?php echo htmlspecialchars($s['color_text_soft'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-line: <?php echo htmlspecialchars($s['color_border'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-focus: <?php echo htmlspecialchars($s['color_hover'], ENT_QUOTES, 'UTF-8'); ?>;

  --stc-font-display: '<?php echo htmlspecialchars($s['font_heading'], ENT_QUOTES, 'UTF-8'); ?>', Georgia, serif;
  --stc-font-body: '<?php echo htmlspecialchars($s['font_body'], ENT_QUOTES, 'UTF-8'); ?>', -apple-system, sans-serif;

  --stc-container: <?php echo (int) $s['container_width']; ?>px;
  --stc-radius-md: <?php echo (int) $s['radius_button']; ?>px;
  --stc-radius-lg: <?php echo (int) $s['radius_card']; ?>px;

  --stc-dur-fast: <?php echo $durFast; ?>ms;
  --stc-dur-base: <?php echo $durBase; ?>ms;
  --stc-dur-slow: <?php echo $durSlow; ?>ms;

  --stc-shadow-sm: <?php echo $shadows['sm']; ?>;
  --stc-shadow-md: <?php echo $shadows['md']; ?>;
  --stc-shadow-lg: <?php echo $shadows['lg']; ?>;

  <?php foreach ($spaceBase as $step => $rem): ?>
  --stc-space-<?php echo $step; ?>: <?php echo round($rem * $spacingFactor, 3); ?>rem;
  <?php endforeach; ?>

  /* ---- Homepage-specific tokens (consumed by assets/css/homepage/*.css) ---- */
  --stc-card-bg: <?php echo htmlspecialchars($s['color_card'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-button-text: <?php echo htmlspecialchars($s['color_button_text'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-gradient-start: <?php echo htmlspecialchars($s['gradient_start'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-gradient-end: <?php echo htmlspecialchars($s['gradient_end'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-hero-overlay: rgba(<?php echo $heroOverlayRgb; ?>, <?php echo $heroOverlayAlpha; ?>);
}

[data-theme="dark"] {
  --stc-paper: <?php echo htmlspecialchars($s['dark_background'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-paper-alt: <?php echo htmlspecialchars($s['dark_background_alt'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-ink: <?php echo htmlspecialchars($s['dark_text'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-ink-soft: <?php echo htmlspecialchars($s['dark_text_soft'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-card-bg: <?php echo htmlspecialchars($s['dark_card'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-line: rgba(255,255,255,0.12);
}

/* The shared header/footer package (header.css, navigation.css,
   footer.css — not modified by this build) mixes a hardcoded light
   "glass" background in .stc-header__main with variable-driven text
   colors (--stc-ink, --stc-paper are reused as text colors in a few
   spots, e.g. the announcement bar). Letting the global dark-mode
   block above cascade into it collides the two, producing
   near-invisible text (light-on-light nav links, dark-on-dark
   announcement text). Rather than editing those files, the header/
   footer/mobile-menu/search-overlay chrome opts out of dark mode
   here and always renders with the site's configured LIGHT palette;
   only the homepage content (#main-content) actually goes dark. */
[data-theme="dark"] .stc-header,
[data-theme="dark"] .stc-announcement,
[data-theme="dark"] .stc-footer,
[data-theme="dark"] .stc-mobile,
[data-theme="dark"] .stc-search-overlay {
  --stc-paper: <?php echo htmlspecialchars($s['color_background'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-paper-alt: <?php echo htmlspecialchars($s['color_background_alt'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-ink: <?php echo htmlspecialchars($s['color_text'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-ink-soft: <?php echo htmlspecialchars($s['color_text_soft'], ENT_QUOTES, 'UTF-8'); ?>;
  --stc-line: <?php echo htmlspecialchars($s['color_border'], ENT_QUOTES, 'UTF-8'); ?>;
}
</style>

<style id="stc-theme-toggle-style">
.stc-theme-toggle {
  position: fixed;
  right: var(--stc-space-5);
  bottom: var(--stc-space-5);
  z-index: 60;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid var(--stc-line);
  background: var(--stc-card-bg, var(--stc-white));
  color: var(--stc-maroon);
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--stc-shadow-md);
  transition: transform var(--stc-dur-fast) var(--stc-ease), box-shadow var(--stc-dur-fast) var(--stc-ease);
}
.stc-theme-toggle:hover,
.stc-theme-toggle:focus-visible {
  transform: translateY(-3px);
  box-shadow: var(--stc-shadow-lg);
}
.stc-theme-toggle:focus-visible {
  outline: 2px solid var(--stc-focus);
  outline-offset: 2px;
}
@media (max-width: 640px) {
  .stc-theme-toggle {
    right: var(--stc-space-4);
    bottom: var(--stc-space-4);
    width: 46px;
    height: 46px;
  }
}
</style>

<!-- Dark mode toggle — standalone control, not part of the shared header/footer -->
<button type="button" id="stcThemeToggle" class="stc-theme-toggle" aria-label="Switch to dark mode" aria-pressed="false">
  <i class="bi bi-moon-stars" aria-hidden="true"></i>
</button>
<script>
  /* Global animation kill-switch (Admin -> Design & Theme). Homepage
     section scripts check this alongside prefers-reduced-motion. */
  window.STC_ANIMATIONS_ENABLED = <?php echo $animationsEnabled ? 'true' : 'false'; ?>;
</script>
<script src="<?php echo BASE_URL; ?>assets/js/homepage/theme-toggle.js" defer></script>
