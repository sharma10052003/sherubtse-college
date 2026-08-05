<?php
/**
 * config.php
 * -----------------------------------------------------------------------
 * Single bootstrap file for the Header/Footer package.
 *
 * WHAT THIS FILE DOES
 *   1. Defines the SHERUBTSE_INIT guard constant. Every include in
 *      /includes checks for this constant and refuses to run standalone
 *      (see the guard block at the top of header.php, footer.php, etc.).
 *      This is what stops someone from requesting
 *      https://sherubtse.edu.bt/includes/header.php directly.
 *   2. Holds ALL editable content for the header & footer — logo path,
 *      college name, navigation tree, quick-link portals, footer
 *      columns, social links, contact details — as plain PHP arrays.
 *
 * WHY ONE FILE
 *   Non-developer staff (comms office) only ever need to touch this
 *   file. They never open header.php/footer.php/navigation.php.
 *   See docs/CONTENT-GUIDE.md for a plain-English walkthrough.
 *
 * USAGE
 *   Require this once, at the very top of every page, BEFORE header.php:
 *
 *       require_once __DIR__ . '/includes/config.php';
 *       include __DIR__ . '/includes/header.php';
 *       // ...page content...
 *       include __DIR__ . '/includes/footer.php';
 * -----------------------------------------------------------------------
 */

// Guard constant — every other include in this folder checks for this.
if (!defined('SHERUBTSE_INIT')) {
    define('SHERUBTSE_INIT', true);
}

// Prevent this file itself from being requested directly over HTTP.
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(403);
    exit('Forbidden');
}

/**
 * Resolve a site-root-relative URL that works both at the domain root and
 * inside a subfolder like /sherubtse-college/.
 */
if (!defined('BASE_URL')) {
    $document_root = rtrim(str_replace('\\', '/', $_SERVER['DOCUMENT_ROOT'] ?? ''), '/');
    $project_root = rtrim(str_replace('\\', '/', realpath(__DIR__ . '/..')), '/');

    $base_path = '/';

    if ($document_root !== '' && $project_root !== '' && strpos($project_root, $document_root) === 0) {
        $relative_path = substr($project_root, strlen($document_root));
        $relative_path = trim($relative_path, '/');

        if ($relative_path !== '') {
            $base_path = '/' . $relative_path . '/';
        }
    }

    define('BASE_URL', $base_path);
}

/**
 * Strapi connection settings — used by includes/strapi-client.php.
 * STRAPI_API_TOKEN is a read-only token (find/findOne only), generated
 * in Strapi admin -> Settings -> API Tokens. Safe to keep server-side
 * only; never exposed to the browser (all Strapi calls happen in curl,
 * server-to-server).
 *
 * The real token lives in includes/config.local.php, which is
 * git-ignored (see includes/config.local.php.example for the template)
 * so it never ends up in version control. Falls back to a placeholder
 * if that file doesn't exist yet (e.g. right after a fresh clone) —
 * stc_strapi_get() will just fail closed and every model falls back to
 * its hardcoded defaults, same as if Strapi were unreachable.
 */
if (!defined('STRAPI_URL')) define('STRAPI_URL', 'http://localhost:1337');
if (is_file(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}
if (!defined('STRAPI_API_TOKEN')) define('STRAPI_API_TOKEN', 'REPLACE_WITH_READ_ONLY_API_TOKEN');

/**
 * Resolves an internal path (e.g. "/about/history") so links work
 * correctly whether the site is hosted at the domain root or inside a
 * subfolder like this local /sherubtse-college/ copy — the same
 * problem BASE_URL already solves for the logo/asset paths above,
 * applied to every nav/footer link below. External URLs (http/https)
 * and the "#" mega-menu placeholders are left untouched.
 */
function stc_url(string $path): string
{
    if ($path === '' || $path === '#' || preg_match('#^https?://#i', $path)) {
        return $path;
    }
    return BASE_URL . ltrim($path, '/');
}

/* =========================================================================
   BRANDING
   ========================================================================= */
$stc_brand = [
    'name'        => '',
    'name_short'  => 'Sherubtse',
    'tagline'     => '',
    'affiliation' => 'A Constituent College of the Royal University of Bhutan',
    'logo'        => BASE_URL . 'assets/images/sherubtse-logo.png',
    'logo_alt'    => 'Sherubtse College crest',
    'favicon'     => BASE_URL . 'assets/images/sherubtse-logo.png',
];

/* =========================================================================
   UTILITY TOP BAR — portals & quick links
   Each item: label, url, icon (Bootstrap Icons class), and optional
   `external` flag (opens in new tab with rel=noopener).
   ========================================================================= */
$stc_quick_links = [
    ['label' => 'Student Portal', 'url' => 'https://portal.sherubtse.edu.bt',  'icon' => 'bi-person-badge',  'external' => true],
    ['label' => 'Staff Portal',   'url' => 'https://staff.sherubtse.edu.bt',   'icon' => 'bi-briefcase',     'external' => true],
    ['label' => 'IMS',            'url' => 'https://ims.sherubtse.edu.bt',     'icon' => 'bi-clipboard-data','external' => true],
    ['label' => 'VLE',            'url' => 'https://vle.sherubtse.edu.bt',     'icon' => 'bi-laptop',        'external' => true],
    ['label' => 'Library',        'url' => 'https://library.sherubtse.edu.bt', 'icon' => 'bi-book',          'external' => true],
    ['label' => 'Webmail',        'url' => 'https://mail.sherubtse.edu.bt',    'icon' => 'bi-envelope',      'external' => true],
];

$stc_social_links = [
    ['label' => 'Facebook',  'url' => 'https://facebook.com/sherubtsecollege', 'icon' => 'bi-facebook'],
    ['label' => 'YouTube',   'url' => 'https://youtube.com/@sherubtsecollege', 'icon' => 'bi-youtube'],
    ['label' => 'Instagram', 'url' => 'https://instagram.com/sherubtsecollege','icon' => 'bi-instagram'],
];

/* =========================================================================
   MAIN NAVIGATION — feeds both the mega-menu (desktop) and the slide-out
   panel (mobile). `mega` = true renders a multi-column panel; omit it
   (or set false) for a plain dropdown; omit `children` entirely for a
   single link with no dropdown.
   ========================================================================= */
   // Each column: heading, links (label, url, icon). Icons are optional.
   //about menu with mega menu columns
$stc_nav = [
    [
        'label' => 'About',
        'url'   => '#',
        'mega'  => true,
        'columns' => [
            [
                'heading' => 'The College',
                'links' => [
                    ['label' => 'History & Heritage', 'url' => '/about/history', 'icon' => 'bi-hourglass-split'],
                    ['label' => "Faculty Profile", 'url' => '/about/faculty', 'icon' => 'bi-person-vcard'],
                    ['label' => 'Vision & Mission',    'url' => '/about/vision',    'icon' => 'bi-bullseye'],
                    ['label' => 'Governance',          'url' => '/about/governance','icon' => 'bi-diagram-3'],
                ],
            ],
            [
                'heading' => 'Campus Life',
                'links' => [
                    ['label' => 'Kanglung Campus', 'url' => '/about/campus',    'icon' => 'bi-geo-alt'],
                    ['label' => 'Student Life',     'url' => '/about/student-life','icon' => 'bi-people'],
                    ['label' => 'Clubs & Societies','url' => '/about/clubs',      'icon' => 'bi-stars'],
                ],
            ],
        ],
    ],
    //Careers menu with mega menu columns
[
    'label' => 'Student Services',
    'url'   => '#',
    'mega'  => true,
    'columns' => [
        [
            'heading' => 'Academic Services',
            'links' => [
                ['label' => 'E-Books & Journals',     'url' => '/student-services/e-books-journals', 'icon' => 'bi-journal-bookmark'],
                ['label' => 'Examination Records',    'url' => '/student-services/examination-records', 'icon' => 'bi-file-earmark-text'],
                ['label' => 'Library',                'url' => '/student-services/library', 'icon' => 'bi-book'],
                ['label' => 'Laboratory',             'url' => '/student-services/laboratory', 'icon' => 'bi-pc-display'],
            ],
        ],
        [
            'heading' => 'Student Life',
            'links' => [
                ['label' => 'Clubs',                  'url' => '/student-services/clubs', 'icon' => 'bi-people'],
                ['label' => 'Games & Sports',         'url' => '/student-services/games-sports', 'icon' => 'bi-trophy'],
                ['label' => 'Student Association',    'url' => '/student-services/student-association', 'icon' => 'bi-people-fill'],
            ],
        ],
        [
            'heading' => 'Support Services',
            'links' => [
                ['label' => 'Happiness & Well-being Center', 'url' => '/student-services/happiness-wellbeing', 'icon' => 'bi-heart-pulse'],
                ['label' => 'Student Related Forms',         'url' => '/student-services/forms', 'icon' => 'bi-file-earmark-richtext'],
            ],
        ],
    ],
],
    //Academics menu with mega menu columns
    [
        'label' => 'Academics',
        'url'   => '#',
        'mega'  => true,
        'columns' => [
            [
                'heading' => 'Programmes',
                'links' => [
                    ['label' => 'Undergraduate Programmes', 'url' => '/academics/undergraduate', 'icon' => 'bi-mortarboard'],
                    ['label' => 'Postgraduate Programmes',  'url' => '/academics/postgraduate',  'icon' => 'bi-award'],
                    ['label' => 'Academic Calendar',        'url' => '/academics/calendar',      'icon' => 'bi-calendar3'],
                ],
            ],
            [
                'heading' => 'Departments',
                'links' => [
                    ['label' => 'Humanities & Social Sciences', 'url' => '/departments/humanities', 'icon' => 'bi-journal-text'],
                    ['label' => 'Commerce',                      'url' => '/departments/commerce',   'icon' => 'bi-graph-up'],
                    ['label' => 'Science & Mathematics',         'url' => '/departments/science',    'icon' => 'bi-clipboard-pulse'],
                ],
            ],
        ],
    ],
    //Admissions menu with mega menu columns
    [
    'label' => 'Admissions',
    'url'   => '#',
    'mega'  => true,
    'columns' => [
        [
            'heading' => 'Apply',
            'links' => [
                ['label' => 'Admission Overview',      'url' => '/admissions',                  'icon' => 'bi-info-circle'],
                ['label' => 'Apply Online',            'url' => '/admissions/apply',            'icon' => 'bi-pencil-square'],
                ['label' => 'Eligibility Criteria',    'url' => '/admissions/eligibility',      'icon' => 'bi-check2-circle'],
                ['label' => 'Admission Process',       'url' => '/admissions/process',          'icon' => 'bi-diagram-3'],
            ],
        ],
        [
            'heading' => 'Information',
            'links' => [
                ['label' => 'Important Dates',         'url' => '/admissions/dates',            'icon' => 'bi-calendar-event'],
                ['label' => 'Fee Structure',           'url' => '/admissions/fees',             'icon' => 'bi-cash-stack'],
                ['label' => 'Scholarships & Financial Aid', 'url' => '/admissions/scholarships','icon' => 'bi-award'],
                ['label' => 'Download Prospectus',     'url' => '/admissions/prospectus',       'icon' => 'bi-file-earmark-pdf'],
            ],
        ],
        [
            'heading' => 'Support',
            'links' => [
                ['label' => 'Required Documents',      'url' => '/admissions/documents',        'icon' => 'bi-folder2-open'],
                ['label' => 'International Students',  'url' => '/admissions/international',   'icon' => 'bi-globe2'],
                ['label' => 'Frequently Asked Questions','url' => '/admissions/faq',            'icon' => 'bi-question-circle'],
                ['label' => 'Contact Admissions',      'url' => '/admissions/contact',          'icon' => 'bi-envelope'],
            ],
        ],
    ],
    ],
    //Research menu with mega menu columns
   [
    'label' => 'Research',
    'url'   => '#',
    'mega'  => true,
    'columns' => [
        [
            'heading' => 'Research Opportunities',
            'links' => [
                ['label' => 'Research Overview',                 'url' => '/research',                        'icon' => 'bi-search'],
                ['label' => 'Sherubtse Thorim Lobdra Research Grant', 'url' => '/research/thorim-lobdra-grant', 'icon' => 'bi-award'],
                ['label' => 'Annual College Research Grant',     'url' => '/research/annual-college-grant',  'icon' => 'bi-cash-coin'],
            ],
        ],
        [
            'heading' => 'Research Centres',
            'links' => [
                ['label' => 'Research Centres',                  'url' => '/research/centres',               'icon' => 'bi-building'],
                ['label' => 'Sherubtse Business Incubation Centre', 'url' => '/research/sbic',              'icon' => 'bi-rocket-takeoff'],
            ],
        ],
        [
            'heading' => 'Publications',
            'links' => [
                ['label' => 'Sherub Doenme Journal',             'url' => '/research/sherub-doenme',         'icon' => 'bi-journal-text'],
                ['label' => 'Asian Journal of Finance & Risk Management (AJFRM)', 'url' => '/research/ajfrm', 'icon' => 'bi-book'],
            ],
        ],
    ],
],

    //Announcements menu with mega menu columns
    [
    'label' => 'Announcements',
    'url'   => '#',
    'mega'  => true,
    'columns' => [
        [
            'heading' => 'Academic Notices',
            'links' => [
                ['label' => 'Semester Registration (Autumn 2026)', 'url' => '/announcements/semester-registration-autumn-2026', 'icon' => 'bi-calendar2-check'],
                ['label' => 'RA Time Table (July 2026)',           'url' => '/announcements/ra-time-table-july-2026',          'icon' => 'bi-table'],
                ['label' => 'SEE Results (Spring 2026)',           'url' => '/announcements/see-results-spring-2026',         'icon' => 'bi-bar-chart'],
                ['label' => 'Hostel Room Allocation',              'url' => '/announcements/hostel-room-allocation',          'icon' => 'bi-building'],
            ],
        ],
        [
            'heading' => 'Admissions',
            'links' => [
                ['label' => 'Selection List (All Programmes)',     'url' => '/announcements/selection-list-all-programmes',   'icon' => 'bi-list-ul'],
                ['label' => 'Science Programme Admission List',    'url' => '/announcements/admission-list-science-program',  'icon' => 'bi-flask'],
                ['label' => 'Final Admitted Students List',        'url' => '/announcements/admitted-list',                   'icon' => 'bi-person-check'],
            ],
        ],
        [
            'heading' => 'General Notices',
            'links' => [
                ['label' => 'News',                                'url' => '/announcements/news',                           'icon' => 'bi-newspaper'],
                ['label' => 'Upcoming Events',                     'url' => '/announcements/events',                         'icon' => 'bi-calendar3'],
                ['label' => 'Vacancies',                           'url' => '/announcements/vacancies',                      'icon' => 'bi-briefcase'],
                ['label' => 'Tenders',                             'url' => '/announcements/tenders',                        'icon' => 'bi-file-earmark-text'],
                ['label' => 'Fee Payment Notifications',           'url' => '/announcements/fee-payment-spring-2026',        'icon' => 'bi-credit-card'],
            ],
        ],
    ],
],
 ['label' => 'Contact',    'url' => '/contact'],
];

/* =========================================================================
   ANNOUNCEMENT BANNER — set 'active' to false to hide site-wide.
   ========================================================================= */
$stc_announcement = [
    'active'  => true,
    'message' => 'Admissions for the 2027 academic year open on 1 December 2026.',
    'link'    => ['label' => 'Learn more', 'url' => '/admissions'],
    'dismissible' => true,
];

/* =========================================================================
   FOOTER CONTENT
   ========================================================================= */
$stc_footer = [
    'about' => 'Founded in 1968, Sherubtse College is the oldest tertiary '
        . 'institution in Bhutan and a constituent college of the Royal '
        . 'University of Bhutan, seated in the eastern hills of Kanglung.',
    'motto' => '"The Seat of Learning"',
    'columns' => [
        [
            'heading' => 'Quick Links',
            'links' => [
                ['label' => 'Admissions',   'url' => '/admissions'],
                ['label' => 'Academics',    'url' => '/academics'],
                ['label' => 'Research',     'url' => '/research'],
                ['label' => 'News & Events','url' => '/news'],
                ['label' => 'Careers',      'url' => '/careers'],
            ],
        ],
        [
            'heading' => 'Resources',
            'links' => [
                ['label' => 'Library',        'url' => 'https://library.sherubtse.edu.bt', 'external' => true],
                ['label' => 'Student Portal',  'url' => 'https://portal.sherubtse.edu.bt',  'external' => true],
                ['label' => 'VLE',             'url' => 'https://vle.sherubtse.edu.bt',     'external' => true],
                ['label' => 'Academic Calendar','url' => '/academics/calendar'],
                ['label' => 'RUB Website',      'url' => 'https://www.rub.edu.bt', 'external' => true],
            ],
        ],
    ],
    'contact' => [
        'address' => 'Sherubtse College, Kanglung, Trashigang 42003, Bhutan',
        'phone'   => '+975-4-535-270',
        'email'   => 'info@sherubtse.edu.bt',
        'map_url' => 'https://maps.google.com/?q=Sherubtse+College+Kanglung',
    ],
    'bottom_links' => [
        ['label' => 'Privacy Policy',  'url' => '/privacy'],
        ['label' => 'Terms of Use',    'url' => '/terms'],
        ['label' => 'Accessibility',   'url' => '/accessibility'],
        ['label' => 'Website Credits', 'url' => '/credits'],
    ],
];

/* =========================================================================
   Resolve every internal link above against BASE_URL in one pass, so
   nothing above this point needs to know whether the site lives at the
   domain root or a subfolder. Must run after $stc_nav / $stc_announcement
   / $stc_footer are fully defined.
   ========================================================================= */
foreach ($stc_nav as &$stc_nav_item) {
    $stc_nav_item['url'] = stc_url($stc_nav_item['url']);
    if (!empty($stc_nav_item['columns'])) {
        foreach ($stc_nav_item['columns'] as &$stc_nav_column) {
            foreach ($stc_nav_column['links'] as &$stc_nav_link) {
                $stc_nav_link['url'] = stc_url($stc_nav_link['url']);
            }
            unset($stc_nav_link);
        }
        unset($stc_nav_column);
    }
}
unset($stc_nav_item);

$stc_announcement['link']['url'] = stc_url($stc_announcement['link']['url']);

foreach ($stc_footer['columns'] as &$stc_footer_column) {
    foreach ($stc_footer_column['links'] as &$stc_footer_link) {
        $stc_footer_link['url'] = stc_url($stc_footer_link['url']);
    }
    unset($stc_footer_link);
}
unset($stc_footer_column);

foreach ($stc_footer['bottom_links'] as &$stc_footer_bottom_link) {
    $stc_footer_bottom_link['url'] = stc_url($stc_footer_bottom_link['url']);
}
unset($stc_footer_bottom_link);
