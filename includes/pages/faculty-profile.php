<?php
/**
 * pages/faculty-profile.php — individual faculty profile content.
 * Included by about/faculty-profile.php, which already fetched $faculty
 * (see stc_get_faculty_by_slug() in models/Faculty.php) and confirmed
 * it's non-null before including this file.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../models/Faculty.php';

$settings = stc_get_faculty_setting();
$f = $faculty;

$galleryGroups = [
    'conference_images'       => ['label' => 'Conferences', 'icon' => 'bi-easel2'],
    'research_photos'         => ['label' => 'Research', 'icon' => 'bi-flask'],
    'department_event_photos' => ['label' => 'Department Events', 'icon' => 'bi-calendar-event'],
    'workshop_photos'         => ['label' => 'Workshops', 'icon' => 'bi-tools'],
];
$hasAnyGalleryPhotos = false;
foreach (array_keys($galleryGroups) as $key) {
    if (!empty($f[$key])) {
        $hasAnyGalleryPhotos = true;
        break;
    }
}

// Same department-themed background as the directory (assets/css/faculty/
// faculty.css) — fixed here to this person's own department since there's
// no filter dropdown on a single profile page.
$bgLayerMap = [
    'humanities-social-sciences' => 'humanities',
    'mathematical-data-sciences' => 'mds',
    'natural-sciences'           => 'natural',
];
$bgLayer = $bgLayerMap[$f['department_slug'] ?? ''] ?? 'other';
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/tailwind.css">
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/faculty.css">

<article class="stc-faculty-profile">

  <div class="stc-faculty-bgfx" aria-hidden="true">
    <?php if ($bgLayer === 'natural'): ?>
      <div class="stc-faculty-bgfx__layer stc-faculty-bgfx__layer--natural is-active">
        <span class="stc-faculty-bgfx__blob"></span><span class="stc-faculty-bgfx__blob"></span>
        <?php for ($i = 0; $i < 22; $i++): ?><span class="stc-faculty-bgfx__particle" style="--i:<?php echo $i; ?>"></span><?php endfor; ?>
      </div>
    <?php elseif ($bgLayer === 'mds'): ?>
      <div class="stc-faculty-bgfx__layer stc-faculty-bgfx__layer--mds is-active">
        <?php for ($i = 0; $i < 16; $i++): ?><span class="stc-faculty-bgfx__tri" style="--i:<?php echo $i; ?>"></span><?php endfor; ?>
        <?php for ($i = 0; $i < 8; $i++): ?><span class="stc-faculty-bgfx__node" style="--i:<?php echo $i; ?>"></span><?php endfor; ?>
      </div>
    <?php elseif ($bgLayer === 'humanities'): ?>
      <div class="stc-faculty-bgfx__layer stc-faculty-bgfx__layer--humanities is-active">
        <span class="stc-faculty-bgfx__blob"></span><span class="stc-faculty-bgfx__blob"></span><span class="stc-faculty-bgfx__blob"></span>
      </div>
    <?php else: ?>
      <div class="stc-faculty-bgfx__layer stc-faculty-bgfx__layer--other is-active">
        <span class="stc-faculty-bgfx__blob"></span><span class="stc-faculty-bgfx__blob"></span>
        <?php for ($i = 0; $i < 6; $i++): ?><span class="stc-faculty-bgfx__node" style="--i:<?php echo $i; ?>"></span><?php endfor; ?>
      </div>
    <?php endif; ?>
  </div>

  <!-- Hero -->
  <section class="stc-faculty-profile-hero"<?php echo $f['cover_image_url'] ? ' style="--stc-faculty-profile-cover:url(\'' . htmlspecialchars($f['cover_image_url'], ENT_QUOTES, 'UTF-8') . '\')"' : ''; ?>>
    <div class="stc-faculty-profile-hero__pattern-border" aria-hidden="true"></div>
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8 stc-faculty-profile-hero__inner">
      <div class="stc-faculty-profile-hero__photo">
        <?php if ($f['profile_picture_url']): ?>
          <img src="<?php echo htmlspecialchars($f['profile_picture_url'], ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($f['full_name'], ENT_QUOTES, 'UTF-8'); ?>">
        <?php else: ?>
          <div class="stc-faculty-profile-hero__placeholder"><i class="bi bi-person-fill" aria-hidden="true"></i></div>
        <?php endif; ?>
      </div>
      <div class="stc-faculty-profile-hero__text" data-reveal>
        <h1 class="font-(family-name:--font-display) text-3xl md:text-4xl text-white"><?php echo htmlspecialchars($f['full_name'], ENT_QUOTES, 'UTF-8'); ?></h1>
        <p class="text-white/85 text-lg mt-1"><?php echo htmlspecialchars($f['position'], ENT_QUOTES, 'UTF-8'); ?></p>
        <?php if ($f['department_name']): ?>
          <p class="text-white/70 mt-1"><i class="bi bi-building" aria-hidden="true"></i> <?php echo htmlspecialchars($f['department_name'], ENT_QUOTES, 'UTF-8'); ?></p>
        <?php endif; ?>

        <div class="stc-faculty-profile-hero__social">
          <?php if (!empty($f['linkedin_url'])): ?><a href="<?php echo htmlspecialchars($f['linkedin_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="bi bi-linkedin" aria-hidden="true"></i></a><?php endif; ?>
          <?php if (!empty($f['google_scholar_url'])): ?><a href="<?php echo htmlspecialchars($f['google_scholar_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener" aria-label="Google Scholar"><i class="bi bi-mortarboard-fill" aria-hidden="true"></i></a><?php endif; ?>
          <?php if (!empty($f['researchgate_url'])): ?><a href="<?php echo htmlspecialchars($f['researchgate_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener" aria-label="ResearchGate"><i class="bi bi-badge-rd" aria-hidden="true"></i></a><?php endif; ?>
          <?php if (!empty($f['orcid_url'])): ?><a href="<?php echo htmlspecialchars($f['orcid_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener" aria-label="ORCID"><i class="bi bi-person-badge-fill" aria-hidden="true"></i></a><?php endif; ?>
          <?php if (!empty($f['personal_website_url'])): ?><a href="<?php echo htmlspecialchars($f['personal_website_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener" aria-label="Personal website"><i class="bi bi-globe2" aria-hidden="true"></i></a><?php endif; ?>
        </div>
      </div>
    </div>
  </section>

  <div class="max-w-(--container-page) mx-auto px-4 md:px-8 stc-faculty-profile-body">
    <div class="stc-faculty-profile-grid">

      <div class="stc-faculty-profile-main">

        <!-- Biography -->
        <section aria-labelledby="stcBioTitle" class="stc-faculty-profile-section">
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-person-lines-fill" aria-hidden="true"></i> Biography</p>
          <h2 id="stcBioTitle">About</h2>
          <?php if (!empty($f['short_biography'])): ?>
            <p class="stc-faculty-prose"><?php echo nl2br(htmlspecialchars($f['short_biography'], ENT_QUOTES, 'UTF-8')); ?></p>
          <?php endif; ?>

          <?php if (!empty($f['highest_qualification']) || !empty($f['university'])): ?>
          <div class="stc-faculty-profile-fact">
            <i class="bi bi-mortarboard" aria-hidden="true"></i>
            <span><?php echo htmlspecialchars(trim($f['highest_qualification'] . (!empty($f['university']) ? ', ' . $f['university'] : ''), ', '), ENT_QUOTES, 'UTF-8'); ?></span>
          </div>
          <?php endif; ?>

          <?php if (!empty($f['work_experience'])): ?>
            <h3 class="mt-6">Experience</h3>
            <p class="stc-faculty-prose"><?php echo nl2br(htmlspecialchars($f['work_experience'], ENT_QUOTES, 'UTF-8')); ?></p>
          <?php endif; ?>

          <?php if (!empty($f['languages_list'])): ?>
            <h3 class="mt-6">Languages</h3>
            <div class="stc-faculty-card__tags">
              <?php foreach ($f['languages_list'] as $lang): ?><span class="stc-faculty-card__tag"><?php echo htmlspecialchars($lang, ENT_QUOTES, 'UTF-8'); ?></span><?php endforeach; ?>
            </div>
          <?php endif; ?>
        </section>

        <!-- Research -->
        <?php if ($settings['show_research']): ?>
        <section aria-labelledby="stcResearchTitle" class="stc-faculty-profile-section">
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-flask-fill" aria-hidden="true"></i> Research</p>
          <h2 id="stcResearchTitle">Research &amp; Publications</h2>

          <?php if (!empty($f['specialization']) || !empty($f['research_areas_list'])): ?>
            <?php if (!empty($f['specialization'])): ?><p class="stc-faculty-prose"><strong>Specialization:</strong> <?php echo htmlspecialchars($f['specialization'], ENT_QUOTES, 'UTF-8'); ?></p><?php endif; ?>
            <?php if (!empty($f['research_areas_list'])): ?>
              <div class="stc-faculty-card__tags mt-2">
                <?php foreach ($f['research_areas_list'] as $tag): ?><span class="stc-faculty-card__tag"><?php echo htmlspecialchars($tag, ENT_QUOTES, 'UTF-8'); ?></span><?php endforeach; ?>
              </div>
            <?php endif; ?>
          <?php endif; ?>

          <?php if ($settings['show_publications'] && !empty($f['publications'])): ?>
            <h3 class="mt-6">Publications</h3>
            <ul class="stc-faculty-publications">
              <?php foreach ($f['publications'] as $pub): ?>
                <li>
                  <p class="stc-faculty-publications__title"><?php echo htmlspecialchars($pub['title'], ENT_QUOTES, 'UTF-8'); ?></p>
                  <p class="stc-faculty-publications__meta">
                    <?php echo htmlspecialchars(implode(' &middot; ', array_filter([$pub['journal'] ?? '', $pub['publication_year'] ?? ''])), ENT_QUOTES, 'UTF-8'); ?>
                    <?php if (!empty($pub['authors'])): ?><br><?php echo htmlspecialchars($pub['authors'], ENT_QUOTES, 'UTF-8'); ?><?php endif; ?>
                  </p>
                  <p class="stc-faculty-publications__links">
                    <?php if (!empty($pub['doi'])): ?><span>DOI: <?php echo htmlspecialchars($pub['doi'], ENT_QUOTES, 'UTF-8'); ?></span><?php endif; ?>
                    <?php if (!empty($pub['pdf_url'])): ?><a href="<?php echo htmlspecialchars($pub['pdf_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener">PDF <i class="bi bi-file-earmark-pdf" aria-hidden="true"></i></a><?php endif; ?>
                    <?php if (!empty($pub['external_link'])): ?><a href="<?php echo htmlspecialchars($pub['external_link'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener">View <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a><?php endif; ?>
                  </p>
                </li>
              <?php endforeach; ?>
            </ul>
          <?php endif; ?>
        </section>
        <?php endif; ?>

        <!-- Teaching -->
        <section aria-labelledby="stcTeachingTitle" class="stc-faculty-profile-section">
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-easel-fill" aria-hidden="true"></i> Teaching</p>
          <h2 id="stcTeachingTitle">Teaching</h2>
          <?php if (!empty($f['teaching_subjects_list'])): ?>
            <div class="stc-faculty-card__tags">
              <?php foreach ($f['teaching_subjects_list'] as $subj): ?><span class="stc-faculty-card__tag"><?php echo htmlspecialchars($subj, ENT_QUOTES, 'UTF-8'); ?></span><?php endforeach; ?>
            </div>
          <?php endif; ?>
          <?php if ($settings['show_office_hours'] && !empty($f['office_hours'])): ?>
            <p class="stc-faculty-profile-fact mt-4"><i class="bi bi-clock-fill" aria-hidden="true"></i> <?php echo htmlspecialchars($f['office_hours'], ENT_QUOTES, 'UTF-8'); ?></p>
          <?php endif; ?>
        </section>

        <!-- Achievements -->
        <?php if ($settings['show_awards'] && !empty($f['awards'])): ?>
        <section aria-labelledby="stcAwardsTitle" class="stc-faculty-profile-section">
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-trophy-fill" aria-hidden="true"></i> Achievements</p>
          <h2 id="stcAwardsTitle">Awards &amp; Achievements</h2>
          <div class="stc-faculty-awards-grid">
            <?php foreach ($f['awards'] as $award): ?>
              <div class="stc-faculty-award-card">
                <i class="bi bi-award-fill" aria-hidden="true"></i>
                <div>
                  <p class="stc-faculty-award-card__name"><?php echo htmlspecialchars($award['award_name'], ENT_QUOTES, 'UTF-8'); ?><?php if (!empty($award['year'])): ?> <span>(<?php echo (int) $award['year']; ?>)</span><?php endif; ?></p>
                  <?php if (!empty($award['description'])): ?><p class="stc-faculty-award-card__desc"><?php echo htmlspecialchars($award['description'], ENT_QUOTES, 'UTF-8'); ?></p><?php endif; ?>
                  <?php if (!empty($award['certificate_url'])): ?><a href="<?php echo htmlspecialchars($award['certificate_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener">View Certificate <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a><?php endif; ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        </section>
        <?php endif; ?>

        <!-- Gallery -->
        <?php if ($settings['show_gallery'] && $hasAnyGalleryPhotos): ?>
        <section aria-labelledby="stcGalleryTitle" class="stc-faculty-profile-section" id="stcFacultyProfileGallery">
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-images" aria-hidden="true"></i> Gallery</p>
          <h2 id="stcGalleryTitle">Gallery</h2>
          <?php foreach ($galleryGroups as $field => $meta): ?>
            <?php if (!empty($f[$field])): ?>
              <h3 class="mt-6 flex items-center gap-2"><i class="<?php echo htmlspecialchars($meta['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i> <?php echo htmlspecialchars($meta['label'], ENT_QUOTES, 'UTF-8'); ?></h3>
              <div class="stc-faculty-gallery-grid">
                <?php foreach ($f[$field] as $i => $imgUrl): ?>
                  <button type="button" class="stc-faculty-gallery-item" data-lightbox-src="<?php echo htmlspecialchars($imgUrl, ENT_QUOTES, 'UTF-8'); ?>">
                    <img src="<?php echo htmlspecialchars($imgUrl, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($meta['label'], ENT_QUOTES, 'UTF-8'); ?> photo <?php echo $i + 1; ?>" loading="lazy">
                  </button>
                <?php endforeach; ?>
              </div>
            <?php endif; ?>
          <?php endforeach; ?>
        </section>
        <?php endif; ?>

      </div>

      <!-- Contact sidebar -->
      <?php if ($settings['show_contact']): ?>
      <aside class="stc-faculty-profile-sidebar" aria-labelledby="stcContactTitle">
        <div class="stc-faculty-contact-card">
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-telephone-fill" aria-hidden="true"></i> Contact</p>
          <h2 id="stcContactTitle" class="!text-lg">Get in Touch</h2>
          <ul class="stc-faculty-contact-list">
            <?php if (!empty($f['college_email'])): ?><li><i class="bi bi-envelope-fill" aria-hidden="true"></i> <a href="mailto:<?php echo htmlspecialchars($f['college_email'], ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($f['college_email'], ENT_QUOTES, 'UTF-8'); ?></a></li><?php endif; ?>
            <?php if (!empty($f['phone_number'])): ?><li><i class="bi bi-telephone-fill" aria-hidden="true"></i> <a href="tel:<?php echo htmlspecialchars($f['phone_number'], ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($f['phone_number'], ENT_QUOTES, 'UTF-8'); ?></a></li><?php endif; ?>
            <?php if (!empty($f['office_location'])): ?><li><i class="bi bi-geo-alt-fill" aria-hidden="true"></i> <?php echo htmlspecialchars($f['office_location'], ENT_QUOTES, 'UTF-8'); ?></li><?php endif; ?>
            <?php if ($settings['show_office_hours'] && !empty($f['office_hours'])): ?><li><i class="bi bi-clock-fill" aria-hidden="true"></i> <?php echo htmlspecialchars($f['office_hours'], ENT_QUOTES, 'UTF-8'); ?></li><?php endif; ?>
          </ul>
          <?php if (!empty($f['google_maps_link'])): ?>
            <a href="<?php echo htmlspecialchars($f['google_maps_link'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener" class="stc-faculty-contact-card__map-btn"><i class="bi bi-map" aria-hidden="true"></i> View on Map</a>
          <?php endif; ?>
        </div>
      </aside>
      <?php endif; ?>

    </div>
  </div>

  <div class="stc-faculty-lightbox" id="stcFacultyProfileLightbox" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
    <button type="button" class="stc-faculty-lightbox__close" id="stcFacultyProfileLightboxClose" aria-label="Close photo viewer"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    <img src="" alt="" id="stcFacultyProfileLightboxImage">
  </div>
</article>

<script src="<?php echo BASE_URL; ?>assets/js/faculty/faculty-profile.js" defer></script>
