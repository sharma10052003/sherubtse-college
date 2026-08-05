/**
 * Row data transcribed from the phpMyAdmin export
 * (sherubtse_college.sql, generated 2026-08-04). Only tables that had
 * real rows in the export are represented here — every other content
 * type exists in Strapi already but is intentionally left unseeded.
 *
 * NOTE: hero_content's cta1_url/cta2_url in the source export were
 * corrupted by a Git-Bash MSYS path-mangling artifact
 * ("C:/Program Files/Git/admissions/apply" instead of "/admissions/apply").
 * They are corrected below — see fixMangledPath() in migrate.js.
 */

module.exports = {
  announcements: [
    {
      title: 'Admissions Open for Academic Year 2027',
      title_dz: '༢༠༢༧ ལོའི་སློབ་ལོའི་ཡིག་ཆ་འབྲེལ་ཞུ་བཟོ་བཅོས་བྱེད་ཀྱི་ཡོད་',
      content: 'Applications are now open for various undergraduate and graduate programs. Apply before March 31, 2027.',
      announcement_type: 'success',
      priority: 10,
      is_scrolling: false,
      is_active: true,
      start_date: '2026-07-25T22:48:46.000Z',
      end_date: '2027-03-31T23:59:59.000Z',
    },
    {
      title: 'Semester Examination Results Published',
      title_dz: 'དབྱར་ཁ་སློབ་དུས་ཀྱི་རྒྱུགས་འགྲུབ་ཐོ་གཏོང་བྱས་ཡོད་',
      content: 'Results for the Fall Semester examinations are now available on the student portal.',
      announcement_type: 'info',
      priority: 8,
      is_scrolling: false,
      is_active: true,
      start_date: '2026-07-25T22:48:46.000Z',
      end_date: '2027-02-28T23:59:59.000Z',
    },
  ],

  galleryContent: {
    title: 'Campus Gallery',
    subtitle: 'A glimpse of life at Sherubtse College — campus, classrooms, events and everything in between.',
  },

  headerSettings: {
    college_name: 'Sherubtse College',
    college_name_dz: 'ཤེས་རུབ་རྩེ་སློབ་གྲྭ་ཆེན་མོ་',
    motto: 'Knowledge is Power',
    motto_dz: null,
    // logo_url pointed at a static asset (assets/images/logo/...), not
    // assets/uploads/ — out of this script's media-upload scope, left
    // empty for manual upload in Strapi admin.
    contact_email: 'info@sherubtse.edu.bt',
    contact_phone: '+975-4-535-128',
    office_hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
    address: 'Kanglung, Trashigang, Bhutan',
  },

  heroContent: {
    title: 'The Seat of Learning in the Eastern Himalayas',
    subtitle: 'Founded in 1968, Sherubtse College is the oldest tertiary institution in Bhutan — a constituent college of the Royal University of Bhutan shaping scholars, leaders and innovators from its hillside campus in Kanglung.',
    cta1_text: 'Apply Now',
    cta1_url: 'C:/Program Files/Git/admissions/apply',
    cta2_text: 'Explore Programmes',
    cta2_url: 'C:/Program Files/Git/academics/undergraduate',
    background_type: 'video',
    media_path: 'hero_79333feee3ece0f709bc94df.mp4',
    overlay_style: 'maroon',
    overlay_opacity: 38,
  },

  heroItems: [
    { item_type: 'stat', icon: 'bi-hourglass-split', value: '58', suffix: '+', label: 'Years of Excellence', sort_order: 0 },
    { item_type: 'stat', icon: 'bi-mortarboard', value: '5000', suffix: '+', label: 'Students Enrolled', sort_order: 1 },
    { item_type: 'stat', icon: 'bi-globe2', value: '12', suffix: '+', label: 'Countries Represented', sort_order: 2 },
    { item_type: 'badge', icon: 'bi-award-fill', value: null, suffix: null, label: "Bhutan's First College", sort_order: 0 },
  ],

  historyContent: {
    hero_title: 'History & Heritage',
    hero_subtitle: 'Sherubtse College — The Peak of Learning',
    hero_intro: "Founded in 1968 in the hills of Kanglung, Sherubtse College is the oldest tertiary institution in Bhutan — a living record of the nation's first steps into modern higher education.",
    hero_image_path: 'hist_7088cca73cd241660457da48.png',
    hero_image_position: 'top',
    founding_story: 'The foundation stone of Sherubtse College was laid in June 1966 by His Majesty the Third Druk Gyalpo, Jigme Dorji Wangchuck, and the institution officially opened its doors in 1968. Its name, "Sherubtse" — meaning "Peak of Learning" — captured the vision behind it: the first modern institution of higher learning in eastern Bhutan, opening a path to education for a region that had never had one.',
    vision_king_text: "His Majesty the Third Druk Gyalpo, Jigme Dorji Wangchuck, is remembered as the father of modern Bhutan, and Sherubtse College stands among the clearest expressions of his vision. He saw modern education as essential to the Kingdom's future, and understood that eastern Bhutan, far from the country's administrative centers, needed a seat of learning of its own. Sherubtse College was founded to answer that need.",
    king_photo_path: 'hist_eba2cd7199814f8be735ff2d.jpg',
    mackey_name: 'Father William Mackey',
    mackey_photo_path: 'hist_d951fbe5ea05a3c93ef120e8.jpg',
    mackey_bio: "Father William Mackey served as the founding principal of Sherubtse College, guiding the institution through its earliest and most formative years. A Canadian Jesuit educator, he played a central role in shaping the college's academic character and its lasting contribution to Bhutanese education — a legacy the college continues to build on today.",
    motto: 'Education for Excellence',
    motto_meaning: "The motto reflects Sherubtse College's founding commitment: that education in eastern Bhutan should not merely exist, but strive for excellence.",
    emblem_meaning: "The college emblem draws on Bhutanese Buddhist and cultural symbolism to represent the institution's heritage and its mission of enlightening minds through learning. (Admin: replace this with the emblem's official description.)",
    values_text: 'Academic excellence, service to the nation, and the preservation of Bhutanese culture and values alongside modern scholarship.',
    video_url: null,
    brochure_path: null,
    then_image_path: 'hist_a5ec5f3e23e13907766328e7.png',
    now_image_path: 'hist_60826069e39deb0c7c6e9de3.png',
  },

  historyLegacyItems: [
    { icon: 'bi-patch-check-fill', text: 'The first accredited college in Bhutan', sort_order: 0 },
    { icon: 'bi-bank', text: 'A constituent college of the Royal University of Bhutan since 2003', sort_order: 1 },
    { icon: 'bi-mortarboard-fill', text: 'Thousands of graduates serving Bhutan across every sector', sort_order: 2 },
    { icon: 'bi-globe-asia-australia', text: 'Lasting contributions in education, government, science and public service', sort_order: 3 },
  ],

  historyTimelineItems: [
    { year: '1966', event: 'Foundation stone laid', description: null, sort_order: 0 },
    { year: '1968', event: 'Sherubtse Public School inaugurated', description: null, sort_order: 1 },
    { year: '1976', event: 'Upgraded to Junior College', description: null, sort_order: 2 },
    { year: '1978', event: 'Arts and Commerce introduced', description: null, sort_order: 3 },
    { year: '1983', event: 'Affiliated with Delhi University', description: null, sort_order: 4 },
    { year: '2003', event: 'Became a constituent college of the Royal University of Bhutan', description: null, sort_order: 5 },
    { year: 'Present', event: 'Leading multidisciplinary college', description: null, sort_order: 6 },
  ],

  historyTraditionItems: [
    { icon: 'bi-brightness-high', title: 'Annual Rimdro & Religious Ceremonies', description: null, sort_order: 0 },
    { icon: 'bi-stars', title: 'College Week Celebrations', description: null, sort_order: 1 },
    { icon: 'bi-book', title: 'Literary & Cultural Festivals', description: null, sort_order: 2 },
    { icon: 'bi-trophy', title: 'Sports & Student Clubs', description: null, sort_order: 3 },
    { icon: 'bi-hand-thumbs-up', title: 'Community Service Activities', description: null, sort_order: 4 },
  ],

  homepageSections: [
    { section_key: 'hero', label: 'Hero', sort_order: 0, is_enabled: true },
    { section_key: 'president', label: "President's Welcome", sort_order: 1, is_enabled: true },
    { section_key: 'vision_mission', label: 'Vision & Mission', sort_order: 2, is_enabled: false },
    { section_key: 'highlights', label: 'College Highlights', sort_order: 3, is_enabled: true },
    { section_key: 'events', label: 'Upcoming Events', sort_order: 4, is_enabled: true },
    { section_key: 'news', label: 'Latest News', sort_order: 5, is_enabled: true },
    { section_key: 'academics', label: 'Academic Excellence', sort_order: 6, is_enabled: true },
    { section_key: 'statistics', label: 'College Statistics', sort_order: 7, is_enabled: true },
    { section_key: 'campus_life', label: 'Campus Life', sort_order: 8, is_enabled: true },
    { section_key: 'research', label: 'Research & Innovation', sort_order: 9, is_enabled: true },
    { section_key: 'gallery', label: 'Image Gallery', sort_order: 10, is_enabled: true },
    { section_key: 'partners', label: 'International Partnerships', sort_order: 11, is_enabled: true },
    { section_key: 'testimonials', label: 'Testimonials', sort_order: 12, is_enabled: true, publish_at: '2026-07-30T09:45:00.000Z', unpublish_at: '2026-07-30T09:45:00.000Z' },
    { section_key: 'cta', label: 'Call To Action', sort_order: 13, is_enabled: true },
  ],

  // sourceId lets migrate.js resolve parent/child relationships before insert.
  menuItems: [
    { sourceId: 1, parentSourceId: null, title: 'Home', title_dz: 'ཁྱིམ་', url: '/', menu_order: 1 },
    { sourceId: 2, parentSourceId: null, title: 'About Us', title_dz: 'སྐོར་', url: '/about', menu_order: 2 },
    { sourceId: 3, parentSourceId: null, title: 'Academics', title_dz: 'སློབ་གསོ་', url: '/academics', menu_order: 3 },
    { sourceId: 4, parentSourceId: null, title: 'Admissions', title_dz: 'ཡིག་ཆ་འབྲེལ་ཞུ་', url: '/admissions', menu_order: 4 },
    { sourceId: 5, parentSourceId: null, title: 'Research', title_dz: 'ཞིབ་འཇུག་', url: '/research', menu_order: 5 },
    { sourceId: 6, parentSourceId: null, title: 'Campus Life', title_dz: 'སློབ་གྲྭའི་འཚོ་བ་', url: '/campus-life', menu_order: 6 },
    { sourceId: 7, parentSourceId: null, title: 'News & Events', title_dz: 'གསར་འགྱུར་དང་བྱེད་སྒོ་', url: '/news-events', menu_order: 7 },
    { sourceId: 8, parentSourceId: null, title: 'Contact', title_dz: 'འབྲེལ་བ་', url: '/contact', menu_order: 8 },
    { sourceId: 9, parentSourceId: 2, title: 'History', title_dz: 'ལོ་རྒྱུས་', url: '/about/history', menu_order: 1 },
    { sourceId: 10, parentSourceId: 2, title: 'Vision & Mission', title_dz: 'མཐོང་ཆེན་དང་དམིགས་ཡུལ་', url: '/about/vision-mission', menu_order: 2 },
    { sourceId: 11, parentSourceId: 2, title: 'Administration', title_dz: 'དོ་དམ་', url: '/about/administration', menu_order: 3 },
    { sourceId: 12, parentSourceId: 3, title: 'Departments', title_dz: 'སྡེ་ཚན་', url: '/academics/departments', menu_order: 1 },
    { sourceId: 13, parentSourceId: 3, title: 'Programs', title_dz: 'སློབ་གསོའི་རིམ་པ་', url: '/academics/programs', menu_order: 2 },
    { sourceId: 14, parentSourceId: 3, title: 'Academic Calendar', title_dz: 'སློབ་དུས་ཐོ་ཐིག་', url: '/academics/calendar', menu_order: 3 },
  ],

  presidentContent: {
    name: 'Matrika Sharma',
    position: 'Office of the President',
    message: "A welcome message from the President will appear here once it's added from the admin panel.",
    photo_path: 'pres_3153b15d6b2ccf25c49a6adc.png',
    signature_path: null,
    button_text: 'Read Full Message',
    button_url: '/about/president',
  },

  themeSettings: {
    color_primary: '#7A1B2B',
    color_secondary: '#4E1019',
    color_accent: '#C7962C',
    color_accent_light: '#E8C97A',
    color_background: '#D1D4D6',
    color_background_alt: '#F3EEE4',
    color_card: '#FFFFFF',
    color_text: '#221A17',
    color_text_soft: '#5B4E48',
    color_border: '#E4DCD1',
    color_button_text: '#FFFFFF',
    color_hover: '#E8C97A',
    gradient_start: '#7A1B2B',
    gradient_end: '#C7962C',
    hero_overlay_color: '#221A17',
    hero_overlay_opacity: 55,
    dark_background: '#1B1412',
    dark_background_alt: '#241A17',
    dark_card: '#241A17',
    dark_text: '#F3EEE4',
    dark_text_soft: '#C9BCB3',
    font_heading: 'Fraunces',
    font_body: 'Public Sans',
    radius_card: 18,
    radius_button: 10,
    shadow_style: 'soft',
    animation_speed: 'normal',
    container_width: 1240,
    spacing_scale: 'comfortable',
    animations_enabled: true,
  },

  socialLinks: [
    { platform: 'Facebook', platform_icon: 'fab fa-facebook', url: 'https://www.facebook.com/sherubtsecollege', is_active: true, display_order: 1 },
    { platform: 'LinkedIn', platform_icon: 'fab fa-linkedin', url: 'https://www.linkedin.com/school/sherubtse-college', is_active: true, display_order: 2 },
    { platform: 'YouTube', platform_icon: 'fab fa-youtube', url: 'https://www.youtube.com/c/sherubtsecollege', is_active: true, display_order: 3 },
    { platform: 'Instagram', platform_icon: 'fab fa-instagram', url: 'https://www.instagram.com/sherubtsecollege', is_active: true, display_order: 4 },
  ],

  uiStrings: [
    { key: 'home', value: 'Home', value_dz: 'ཁྱིམ་', group_name: 'navigation' },
    { key: 'about', value: 'About', value_dz: 'སྐོར་', group_name: 'navigation' },
    { key: 'academics', value: 'Academics', value_dz: 'སློབ་གསོ་', group_name: 'navigation' },
    { key: 'admissions', value: 'Admissions', value_dz: 'ཡིག་ཆ་འབྲེལ་ཞུ་', group_name: 'navigation' },
    { key: 'research', value: 'Research', value_dz: 'ཞིབ་འཇུག་', group_name: 'navigation' },
    { key: 'campus_life', value: 'Campus Life', value_dz: 'སློབ་གྲྭའི་འཚོ་བ་', group_name: 'navigation' },
    { key: 'library', value: 'Library', value_dz: 'དཔེ་མཛོད་', group_name: 'utility' },
    { key: 'vle', value: 'VLE', value_dz: 'VLE', group_name: 'utility' },
    { key: 'webmail', value: 'Webmail', value_dz: 'དྲ་ཐོག་འཕྲིན་ཤོག་', group_name: 'utility' },
  ],

  utilityLinks: [
    { title: 'Library', title_dz: 'དཔེ་མཛོད་', url: '/library', icon: 'fas fa-book', is_active: true, display_order: 1, is_external: false },
    { title: 'VLE', title_dz: 'VLE', url: '/vle', icon: 'fas fa-graduation-cap', is_active: true, display_order: 2, is_external: false },
    { title: 'Webmail', title_dz: 'དྲ་ཐོག་འཕྲིན་ཤོག་', url: '/webmail', icon: 'fas fa-envelope', is_active: true, display_order: 3, is_external: false },
  ],
};
