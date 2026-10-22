import type { Schema, Struct } from '@strapi/strapi';

export interface AboutCoreValue extends Struct.ComponentSchema {
  collectionName: 'components_about_core_values';
  info: {
    description: 'One official core value name plus a short supporting description.';
    displayName: 'Core Value';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Enumeration<
      [
        'professionalism',
        'innovation',
        'learning',
        'ownership',
        'community',
        'excellence',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'excellence'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutMissionItem extends Struct.ComponentSchema {
  collectionName: 'components_about_mission_items';
  info: {
    description: 'One official mission statement, with a short display title.';
    displayName: 'Mission Statement';
    icon: 'rocket';
  };
  attributes: {
    statement: Schema.Attribute.Text & Schema.Attribute.Required;
    theme: Schema.Attribute.Enumeration<['learning', 'research']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'learning'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdmissionGuideContact extends Struct.ComponentSchema {
  collectionName: 'components_admission_guide_contacts';
  info: {
    description: 'Who to contact.';
    displayName: 'Contact';
    icon: 'bulletList';
  };
  attributes: {
    email: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    note: Schema.Attribute.Text;
    phone: Schema.Attribute.String;
    role: Schema.Attribute.String;
  };
}

export interface AdmissionGuideFact extends Struct.ComponentSchema {
  collectionName: 'components_admission_guide_facts';
  info: {
    description: 'A short label and value shown at the top of the page, e.g. \u201CApplications open\u201D \u2014 \u201C1\u201315 March 2026\u201D.';
    displayName: 'Key Fact';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdmissionGuideFaq extends Struct.ComponentSchema {
  collectionName: 'components_admission_guide_faqs';
  info: {
    description: 'A question and its answer.';
    displayName: 'Question';
    icon: 'bulletList';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdmissionGuideFee extends Struct.ComponentSchema {
  collectionName: 'components_admission_guide_fees';
  info: {
    description: 'One fee row. Type the amount as published, e.g. \u201CNu. 78,505\u201D.';
    displayName: 'Fee';
    icon: 'bulletList';
  };
  attributes: {
    amount: Schema.Attribute.String & Schema.Attribute.Required;
    item: Schema.Attribute.String & Schema.Attribute.Required;
    note: Schema.Attribute.Text;
    period: Schema.Attribute.String;
  };
}

export interface AdmissionGuideInfo extends Struct.ComponentSchema {
  collectionName: 'components_admission_guide_infos';
  info: {
    description: 'A titled block for the \u201CMore info\u201D tab (e.g. Visa, Accommodation).';
    displayName: 'Information Block';
    icon: 'bulletList';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdmissionGuideKeyDate extends Struct.ComponentSchema {
  collectionName: 'components_admission_guide_key_dates';
  info: {
    description: 'A date on the Admissions timeline.';
    displayName: 'Key Date';
    icon: 'bulletList';
  };
  attributes: {
    audience: Schema.Attribute.Enumeration<
      ['all', 'bhutanese', 'international']
    > &
      Schema.Attribute.DefaultTo<'all'>;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdmissionGuidePageLabels extends Struct.ComponentSchema {
  collectionName: 'components_admission_guide_page_labels';
  info: {
    description: 'Fixed words on the Admissions pages: tab names, buttons and status badges. Leave a field empty to use the default.';
    displayName: 'Page Labels';
    icon: 'feather';
  };
  attributes: {
    ask_button: Schema.Attribute.String;
    card_button: Schema.Attribute.String;
    date_next: Schema.Attribute.String;
    date_passed: Schema.Attribute.String;
    deadline_label: Schema.Attribute.String;
    documents_heading: Schema.Attribute.String;
    faq_collapse: Schema.Attribute.String;
    faq_expand: Schema.Attribute.String;
    filter_all: Schema.Attribute.String;
    links_heading: Schema.Attribute.String;
    minimum_label: Schema.Attribute.String;
    notices_all: Schema.Attribute.String;
    notices_empty: Schema.Attribute.String;
    notices_past: Schema.Attribute.String;
    seats_label: Schema.Attribute.String;
    selection_label: Schema.Attribute.String;
    status_closed: Schema.Attribute.String;
    status_open: Schema.Attribute.String;
    status_upcoming: Schema.Attribute.String;
    switch_label: Schema.Attribute.String;
    tab_apply: Schema.Attribute.String;
    tab_contact: Schema.Attribute.String;
    tab_faqs: Schema.Attribute.String;
    tab_fees: Schema.Attribute.String;
    tab_more: Schema.Attribute.String;
    tab_notices: Schema.Attribute.String;
    tab_requirements: Schema.Attribute.String;
    tab_scholarships: Schema.Attribute.String;
  };
}

export interface AdmissionGuideRequirement extends Struct.ComponentSchema {
  collectionName: 'components_admission_guide_requirements';
  info: {
    description: 'Entry requirement for one programme (or a group).';
    displayName: 'Programme Requirement';
    icon: 'bulletList';
  };
  attributes: {
    minimum: Schema.Attribute.Text & Schema.Attribute.Required;
    programme: Schema.Attribute.String & Schema.Attribute.Required;
    seats: Schema.Attribute.String;
    selection: Schema.Attribute.Text;
  };
}

export interface AdmissionGuideRoute extends Struct.ComponentSchema {
  collectionName: 'components_admission_guide_routes';
  info: {
    description: 'One way to apply (e.g. for a group of programmes).';
    displayName: 'Application Route';
    icon: 'bulletList';
  };
  attributes: {
    closes_on: Schema.Attribute.Date;
    description: Schema.Attribute.Text;
    for_programmes: Schema.Attribute.String;
    opens_on: Schema.Attribute.Date;
    portal_label: Schema.Attribute.String;
    portal_url: Schema.Attribute.String;
    steps: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdmissionGuideScholarship extends Struct.ComponentSchema {
  collectionName: 'components_admission_guide_scholarships';
  info: {
    description: 'A scholarship or financial support.';
    displayName: 'Scholarship';
    icon: 'bulletList';
  };
  attributes: {
    deadline: Schema.Attribute.Date;
    eligibility: Schema.Attribute.Text;
    how_to_apply: Schema.Attribute.Text;
    link_label: Schema.Attribute.String;
    link_url: Schema.Attribute.String;
    summary: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdmissionEnquiryOption extends Struct.ComponentSchema {
  collectionName: 'components_admission_enquiry_options';
  info: {
    description: 'An option in the enquiry form, and the email address its enquiries are assigned to.';
    displayName: 'Enquiry Category';
    icon: 'question';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    recipient_email: Schema.Attribute.Email;
  };
}

export interface AnnouncementsPositionOpening extends Struct.ComponentSchema {
  collectionName: 'components_announcements_position_openings';
  info: {
    displayName: 'Position Opening';
    icon: 'briefcase';
  };
  attributes: {
    eligibility_criteria: Schema.Attribute.Text;
    mode_of_employment: Schema.Attribute.String;
    particular: Schema.Attribute.String;
    position_level: Schema.Attribute.String;
    position_title: Schema.Attribute.String & Schema.Attribute.Required;
    slots: Schema.Attribute.Integer;
  };
}

export interface AnnouncementsShortlistRow extends Struct.ComponentSchema {
  collectionName: 'components_announcements_shortlist_rows';
  info: {
    displayName: 'Shortlisted Candidate';
    icon: 'user';
  };
  attributes: {
    cid_number: Schema.Attribute.String;
    contact_number: Schema.Attribute.String;
    position_title: Schema.Attribute.String & Schema.Attribute.Required;
    remarks: Schema.Attribute.String;
    score: Schema.Attribute.String;
  };
}

export interface AnnouncementsWrittenExamCandidate
  extends Struct.ComponentSchema {
  collectionName: 'components_announcements_written_exam_candidates';
  info: {
    displayName: 'Written Exam Candidate';
    icon: 'user';
  };
  attributes: {
    cid_number: Schema.Attribute.String;
    contact_number: Schema.Attribute.String;
    position_title: Schema.Attribute.String & Schema.Attribute.Required;
    qualification: Schema.Attribute.String;
    remarks: Schema.Attribute.String;
  };
}

export interface ContactHelpTopic extends Struct.ComponentSchema {
  collectionName: 'components_contact_help_topics';
  info: {
    description: 'One button in "How Can We Help?". Office must match an office\'s Group Title exactly.';
    displayName: 'Help Topic';
    icon: 'question';
  };
  attributes: {
    emoji: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    office: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactPageLabels extends Struct.ComponentSchema {
  collectionName: 'components_contact_page_labels';
  info: {
    description: 'Small labels and messages used across the Contact page. {count}, {shown}, {query} and {field} are filled in automatically.';
    displayName: 'Labels & Messages';
    icon: 'feather';
  };
  attributes: {
    address_label: Schema.Attribute.String;
    campus_map_note: Schema.Attribute.String;
    copied_label: Schema.Attribute.String;
    copy_address_label: Schema.Attribute.String;
    directions_note: Schema.Attribute.String;
    directory_eyebrow: Schema.Attribute.String;
    email_label: Schema.Attribute.String;
    finder_eyebrow: Schema.Attribute.String;
    form_details_legend: Schema.Attribute.String;
    form_enquiry_legend: Schema.Attribute.String;
    form_fix_message: Schema.Attribute.String;
    form_optional_text: Schema.Attribute.String;
    form_required_note: Schema.Attribute.String;
    form_sending_message: Schema.Attribute.String;
    hours_label: Schema.Attribute.String;
    ict_eyebrow: Schema.Attribute.String;
    info_eyebrow: Schema.Attribute.String;
    location_eyebrow: Schema.Attribute.String;
    map_caption: Schema.Attribute.String;
    map_pin_label: Schema.Attribute.String;
    not_confirmed_text: Schema.Attribute.String;
    phone_label: Schema.Attribute.String;
    quick_actions_label: Schema.Attribute.String;
    rate_limit_message: Schema.Attribute.String;
    search_clear_label: Schema.Attribute.String;
    search_count_text: Schema.Attribute.String;
    search_empty_hint: Schema.Attribute.String;
    search_match_text: Schema.Attribute.String;
    search_reset_label: Schema.Attribute.String;
    spotlight_kicker: Schema.Attribute.String;
    telephone_label: Schema.Attribute.String;
    validation_department: Schema.Attribute.String;
    validation_email: Schema.Attribute.String;
    validation_required: Schema.Attribute.String;
  };
}

export interface FacilitiesFeature extends Struct.ComponentSchema {
  collectionName: 'components_facilities_features';
  info: {
    description: 'A short highlight card: a title and one line.';
    displayName: 'Feature';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Enumeration<
      [
        'book',
        'screen',
        'study',
        'journal',
        'flask',
        'microscope',
        'atom',
        'shield',
        'tools',
        'sport',
        'home',
        'heart',
        'health',
        'wifi',
        'people',
        'pin',
        'clock',
        'link',
        'star',
      ]
    > &
      Schema.Attribute.DefaultTo<'star'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FacilitiesFeatureBlock extends Struct.ComponentSchema {
  collectionName: 'components_facilities_feature_blocks';
  info: {
    description: 'Content for the Library or Laboratories feature.';
    displayName: 'Featured Facility Content';
    icon: 'star';
  };
  attributes: {
    documents: Schema.Attribute.Component<'shared.attachment', true>;
    facility: Schema.Attribute.Relation<'manyToOne', 'api::facility.facility'>;
    features: Schema.Attribute.Component<'facilities.feature', true>;
    gallery: Schema.Attribute.Media<'images', true>;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    image_position: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    intro: Schema.Attribute.RichText;
    label: Schema.Attribute.String;
    links: Schema.Attribute.Component<'shared.link-item', true>;
    more_content: Schema.Attribute.RichText;
    more_heading: Schema.Attribute.String;
  };
}

export interface FacilitiesMessages extends Struct.ComponentSchema {
  collectionName: 'components_facilities_messages';
  info: {
    description: 'Shown when nothing is available.';
    displayName: 'Empty-State Messages';
    icon: 'message';
  };
  attributes: {
    no_facilities: Schema.Attribute.Text;
    no_filter_results: Schema.Attribute.Text;
    no_gallery: Schema.Attribute.Text;
    no_lab_profiles: Schema.Attribute.Text;
  };
}

export interface FacilitiesNavLink extends Struct.ComponentSchema {
  collectionName: 'components_facilities_nav_links';
  info: {
    description: 'A hero link. Use #library, #laboratories, #facilities, or ?category=slug#facilities to open a filtered list.';
    displayName: 'Quick Navigation Link';
    icon: 'link';
  };
  attributes: {
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    target: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FacilitiesSectionDirectory extends Struct.ComponentSchema {
  collectionName: 'components_facilities_section_directory';
  info: {
    description: 'Each published Facility as a numbered editorial story, with an \u201CExplore facility details\u201D toggle. Facilities linked to the Library or Laboratories feature are not repeated here.';
    displayName: 'Section \u2013 Facility Stories';
    icon: 'layout';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    card_style: Schema.Attribute.Enumeration<['image_top', 'image_left']> &
      Schema.Attribute.DefaultTo<'image_top'>;
    columns: Schema.Attribute.Enumeration<['three', 'four']> &
      Schema.Attribute.DefaultTo<'three'>;
    expand_label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Explore facility details'>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    layout: Schema.Attribute.Enumeration<['alternating', 'list']> &
      Schema.Attribute.DefaultTo<'alternating'>;
    show_filters: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_search: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface FacilitiesSectionGallery extends Struct.ComponentSchema {
  collectionName: 'components_facilities_section_gallery';
  info: {
    description: 'Photos from About \u2013 Campus Facilities: Gallery.';
    displayName: 'Section \u2013 Campus Gallery';
    icon: 'layout';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    layout: Schema.Attribute.Enumeration<['grid', 'mosaic']> &
      Schema.Attribute.DefaultTo<'mosaic'>;
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<24>;
    show_filters: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface FacilitiesSectionIndex extends Struct.ComponentSchema {
  collectionName: 'components_facilities_section_index';
  info: {
    description: 'A numbered index of the Library, Laboratories and every published facility, linking to its story.';
    displayName: 'Section \u2013 Facility Index';
    icon: 'bulletList';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    columns: Schema.Attribute.Enumeration<['two', 'three']> &
      Schema.Attribute.DefaultTo<'three'>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface FacilitiesSectionLaboratories extends Struct.ComponentSchema {
  collectionName: 'components_facilities_section_laboratories';
  info: {
    description: 'Shows the Laboratories content from Page Settings, plus facilities in the chosen category as laboratory profiles.';
    displayName: 'Section \u2013 Laboratories';
    icon: 'layout';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    profiles_category: Schema.Attribute.Relation<
      'manyToOne',
      'api::facility-category.facility-category'
    >;
  };
}

export interface FacilitiesSectionLibrary extends Struct.ComponentSchema {
  collectionName: 'components_facilities_section_library';
  info: {
    description: 'Shows the Library content from Page Settings.';
    displayName: 'Section \u2013 Library';
    icon: 'layout';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface FacilitiesSectionLinks extends Struct.ComponentSchema {
  collectionName: 'components_facilities_section_links';
  info: {
    description: 'Cards from About \u2013 Campus Facilities: Quick Links.';
    displayName: 'Section \u2013 Useful Links';
    icon: 'layout';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    columns: Schema.Attribute.Enumeration<['three', 'four']> &
      Schema.Attribute.DefaultTo<'four'>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface HomeCampus extends Struct.ComponentSchema {
  collectionName: 'components_home_campus';
  info: {
    description: 'Campus facilities and picture cards.';
    displayName: 'Student Life & Campus';
    icon: 'house';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    cards: Schema.Attribute.Component<'home.card', true>;
    facilities: Schema.Attribute.Relation<
      'manyToMany',
      'api::facility.facility'
    >;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    layout: Schema.Attribute.Enumeration<['mosaic', 'grid']> &
      Schema.Attribute.DefaultTo<'mosaic'>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    width: Schema.Attribute.Enumeration<['full', 'half']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface HomeCard extends Struct.ComponentSchema {
  collectionName: 'components_home_cards';
  info: {
    description: 'A picture card: an image with a title, short text and a link.';
    displayName: 'Card';
    icon: 'picture';
  };
  attributes: {
    caption: Schema.Attribute.String;
    category: Schema.Attribute.String;
    date: Schema.Attribute.Date;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    link_label: Schema.Attribute.String;
    link_url: Schema.Attribute.String;
    summary: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeEvents extends Struct.ComponentSchema {
  collectionName: 'components_home_events';
  info: {
    description: 'Events from News & Notices \u2013 Events. Past events drop off automatically.';
    displayName: 'Upcoming Events';
    icon: 'calendar';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    empty_text: Schema.Attribute.String;
    featured_first: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4>;
    width: Schema.Attribute.Enumeration<['full', 'half']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface HomeHighlights extends Struct.ComponentSchema {
  collectionName: 'components_home_highlights';
  info: {
    description: 'Photo stories from News. Newest first; pinned stories always stay at the front.';
    displayName: 'Latest Highlights';
    icon: 'picture';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    empty_text: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    layout: Schema.Attribute.Enumeration<['feature', 'grid']> &
      Schema.Attribute.DefaultTo<'feature'>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    selection: Schema.Attribute.Enumeration<
      ['latest', 'featured_only', 'manual']
    > &
      Schema.Attribute.DefaultTo<'latest'>;
    stories: Schema.Attribute.Relation<'manyToMany', 'api::news.news'>;
    width: Schema.Attribute.Enumeration<['full', 'half']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface HomeIntroduction extends Struct.ComponentSchema {
  collectionName: 'components_home_introductions';
  info: {
    description: 'A short introduction with a photograph and links.';
    displayName: 'College Introduction';
    icon: 'information';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    body: Schema.Attribute.RichText;
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    links: Schema.Attribute.Component<'shared.link-item', true>;
    width: Schema.Attribute.Enumeration<['full', 'half']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface HomeLabels extends Struct.ComponentSchema {
  collectionName: 'components_home_labels';
  info: {
    description: 'Small fixed words used across the homepage.';
    displayName: 'Homepage Labels';
    icon: 'feather';
  };
  attributes: {
    all_day: Schema.Attribute.String;
    closed: Schema.Attribute.String;
    closes_soon: Schema.Attribute.String;
    deadline: Schema.Attribute.String;
    download: Schema.Attribute.String;
    featured: Schema.Attribute.String;
    open_programme: Schema.Attribute.String;
    pause_video: Schema.Attribute.String;
    photos_count: Schema.Attribute.String;
    pinned: Schema.Attribute.String;
    play_video: Schema.Attribute.String;
    read_more: Schema.Attribute.String;
    register: Schema.Attribute.String;
    source: Schema.Attribute.String;
    swipe_hint: Schema.Attribute.String;
    ticker_label: Schema.Attribute.String;
    today: Schema.Attribute.String;
    view_photos: Schema.Attribute.String;
    visit: Schema.Attribute.String;
  };
}

export interface HomeLinkCards extends Struct.ComponentSchema {
  collectionName: 'components_home_link_cards';
  info: {
    description: 'Simple cards linking to pages, e.g. \u201CAcademics\u201D, \u201CAdmissions\u201D.';
    displayName: 'Link Cards';
    icon: 'apps';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    cards: Schema.Attribute.Component<'shared.landing-card', true>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    width: Schema.Attribute.Enumeration<['full', 'half']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface HomeMessage extends Struct.ComponentSchema {
  collectionName: 'components_home_messages';
  info: {
    description: 'A message from the President. Hidden until a message is entered.';
    displayName: 'Leadership Message';
    icon: 'quote';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    message: Schema.Attribute.RichText;
    name: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images'>;
    photo_alt: Schema.Attribute.String;
    role: Schema.Attribute.String;
    width: Schema.Attribute.Enumeration<['full', 'half']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface HomeNotices extends Struct.ComponentSchema {
  collectionName: 'components_home_notices';
  info: {
    description: 'The latest notices, vacancies and announcements (the same feed as the Announcements page).';
    displayName: 'News & Notices';
    icon: 'bell';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    empty_text: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    pinned_first: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    width: Schema.Attribute.Enumeration<['full', 'half']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface HomeProgrammes extends Struct.ComponentSchema {
  collectionName: 'components_home_programmes';
  info: {
    description: 'Programme cards. Pick programmes to show them in that order; leave empty to show all.';
    displayName: 'Programmes';
    icon: 'book';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 24;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<8>;
    programmes: Schema.Attribute.Relation<
      'manyToMany',
      'api::programme.programme'
    >;
    width: Schema.Attribute.Enumeration<['full', 'half']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface HomeResearch extends Struct.ComponentSchema {
  collectionName: 'components_home_research';
  info: {
    description: 'Research stories (from News), research centres and extra cards.';
    displayName: 'Research & Innovation';
    icon: 'lightbulb';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    cards: Schema.Attribute.Component<'home.card', true>;
    centres: Schema.Attribute.Relation<
      'manyToMany',
      'api::research-centre.research-centre'
    >;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    stories: Schema.Attribute.Relation<'manyToMany', 'api::news.news'>;
    width: Schema.Attribute.Enumeration<['full', 'half']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface HomeResources extends Struct.ComponentSchema {
  collectionName: 'components_home_resources';
  info: {
    description: 'Downloads and useful links.';
    displayName: 'Resources';
    icon: 'download';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    documents: Schema.Attribute.Relation<
      'manyToMany',
      'api::document.document'
    >;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    links: Schema.Attribute.Component<'shared.landing-card', true>;
    width: Schema.Attribute.Enumeration<['full', 'half']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface HomeStat extends Struct.ComponentSchema {
  collectionName: 'components_home_stat_items';
  info: {
    description: 'A verified figure. Only figures marked \u201CVerified\u201D are shown.';
    displayName: 'Statistic';
    icon: 'chartPie';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    note: Schema.Attribute.String;
    source: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
    verified: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface HomeStats extends Struct.ComponentSchema {
  collectionName: 'components_home_stats';
  info: {
    description: 'Verified figures only. The section hides itself when none are verified.';
    displayName: 'Facts & Figures';
    icon: 'chartBubble';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<['white', 'soft', 'navy']> &
      Schema.Attribute.DefaultTo<'white'>;
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    items: Schema.Attribute.Component<'home.stat', true>;
    width: Schema.Attribute.Enumeration<['full', 'half']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface NavigationNavItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_items';
  info: {
    displayName: 'Nav Item';
    icon: 'bulletList';
  };
  attributes: {
    children: Schema.Attribute.Component<'shared.link-item', true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface ProgrammeCurriculumBlock extends Struct.ComponentSchema {
  collectionName: 'components_programme_curriculum_blocks';
  info: {
    displayName: 'Curriculum Block';
    icon: 'layer';
  };
  attributes: {
    courses: Schema.Attribute.Text & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ResearchDocLink extends Struct.ComponentSchema {
  collectionName: 'components_research_doc_links';
  info: {
    description: 'A link to an official document or page.';
    displayName: 'Document Link';
    icon: 'link';
  };
  attributes: {
    file_type: Schema.Attribute.Enumeration<['pdf', 'docx', 'page', 'other']> &
      Schema.Attribute.DefaultTo<'page'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ResearchFacility extends Struct.ComponentSchema {
  collectionName: 'components_research_facilities';
  info: {
    description: 'A documented laboratory, instrument or facility.';
    displayName: 'Research Facility';
    icon: 'cog';
  };
  attributes: {
    centre: Schema.Attribute.Relation<
      'manyToOne',
      'api::research-centre.research-centre'
    >;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    link_label: Schema.Attribute.String;
    link_url: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    summary: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ResearchGrant extends Struct.ComponentSchema {
  collectionName: 'components_research_grants';
  info: {
    description: 'A research grant and its official documents.';
    displayName: 'Grant';
    icon: 'priceTag';
  };
  attributes: {
    acronym: Schema.Attribute.String;
    announcement_url: Schema.Attribute.String;
    deadline: Schema.Attribute.Date;
    description: Schema.Attribute.Text;
    documents: Schema.Attribute.Component<'research.doc-link', true>;
    focus_areas: Schema.Attribute.Text;
    level: Schema.Attribute.Enumeration<['college', 'university', 'external']> &
      Schema.Attribute.DefaultTo<'college'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    status: Schema.Attribute.Enumeration<['not_shown', 'open', 'closed']> &
      Schema.Attribute.DefaultTo<'not_shown'>;
  };
}

export interface ResearchJournal extends Struct.ComponentSchema {
  collectionName: 'components_research_journals';
  info: {
    description: 'The College research journal.';
    displayName: 'Journal';
    icon: 'book';
  };
  attributes: {
    articles: Schema.Attribute.Component<'research.journal-article', true>;
    cover: Schema.Attribute.Media<'images'>;
    cover_alt: Schema.Attribute.String;
    current_issue: Schema.Attribute.String;
    current_issue_date: Schema.Attribute.Date;
    description: Schema.Attribute.Text;
    issn_online: Schema.Attribute.String;
    issn_print: Schema.Attribute.String;
    links: Schema.Attribute.Component<'research.doc-link', true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ResearchJournalArticle extends Struct.ComponentSchema {
  collectionName: 'components_research_journal_articles';
  info: {
    description: 'An article from the journal, linked to its page.';
    displayName: 'Journal Article';
    icon: 'file';
  };
  attributes: {
    authors: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ResearchLabels extends Struct.ComponentSchema {
  collectionName: 'components_research_labels';
  info: {
    description: 'Small fixed words on the Research pages.';
    displayName: 'Research Page Labels';
    icon: 'feather';
  };
  attributes: {
    all_centres: Schema.Attribute.String;
    all_funding: Schema.Attribute.String;
    all_news: Schema.Attribute.String;
    budget: Schema.Attribute.String;
    co_investigators: Schema.Attribute.String;
    college_grants: Schema.Attribute.String;
    contact: Schema.Attribute.String;
    current_issue: Schema.Attribute.String;
    deadline: Schema.Attribute.String;
    documents: Schema.Attribute.String;
    explore_centre: Schema.Attribute.String;
    externally_funded: Schema.Attribute.String;
    funding: Schema.Attribute.String;
    issn_online: Schema.Attribute.String;
    issn_print: Schema.Attribute.String;
    listed_projects: Schema.Attribute.String;
    no_results: Schema.Attribute.String;
    on_this_page: Schema.Attribute.String;
    period: Schema.Attribute.String;
    pi: Schema.Attribute.String;
    read_more: Schema.Attribute.String;
    search_projects: Schema.Attribute.String;
    show_all: Schema.Attribute.String;
    status_closed: Schema.Attribute.String;
    status_completed: Schema.Attribute.String;
    status_ongoing: Schema.Attribute.String;
    status_open: Schema.Attribute.String;
    status_unconfirmed: Schema.Attribute.String;
    tab_completed: Schema.Attribute.String;
    tab_ongoing: Schema.Attribute.String;
    themes: Schema.Attribute.String;
    university_grants: Schema.Attribute.String;
    view_all_projects: Schema.Attribute.String;
  };
}

export interface ResearchResource extends Struct.ComponentSchema {
  collectionName: 'components_research_resources';
  info: {
    description: 'An official policy, guideline or requirement.';
    displayName: 'Policy or Guideline';
    icon: 'shield';
  };
  attributes: {
    description: Schema.Attribute.Text;
    file_type: Schema.Attribute.Enumeration<['pdf', 'docx', 'page', 'other']> &
      Schema.Attribute.DefaultTo<'page'>;
    source: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_sections_call_to_actions';
  info: {
    displayName: 'Call to Action';
    icon: 'cursor';
  };
  attributes: {
    button_label: Schema.Attribute.String;
    button_url: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text;
  };
}

export interface SectionsImageText extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_texts';
  info: {
    displayName: 'Image and Text';
    icon: 'picture';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    image_side: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
  };
}

export interface SectionsRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_rich_texts';
  info: {
    displayName: 'Text Block';
    icon: 'align-left';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    heading: Schema.Attribute.String;
  };
}

export interface SharedAttachment extends Struct.ComponentSchema {
  collectionName: 'components_shared_attachments';
  info: {
    displayName: 'Attachment';
    icon: 'paperclip';
  };
  attributes: {
    file: Schema.Attribute.Media<'files'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    displayName: 'Button';
    icon: 'cursor';
  };
  attributes: {
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedContactBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_blocks';
  info: {
    displayName: 'Contact Block';
    icon: 'phone';
  };
  attributes: {
    email: Schema.Attribute.String;
    hours: Schema.Attribute.String;
    office: Schema.Attribute.String;
    phone: Schema.Attribute.String;
  };
}

export interface SharedContactItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_items';
  info: {
    displayName: 'Contact Item';
    icon: 'phone';
  };
  attributes: {
    kind: Schema.Attribute.Enumeration<
      ['phone', 'email', 'person', 'address']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'phone'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    link: Schema.Attribute.String;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    displayName: 'FAQ Item';
    icon: 'question-mark';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedIconCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_icon_cards';
  info: {
    displayName: 'Icon Card';
    icon: 'star';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<
      ['cap', 'people', 'shield', 'compass', 'book', 'star', 'heart', 'globe']
    > &
      Schema.Attribute.DefaultTo<'star'>;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLandingCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_landing_cards';
  info: {
    displayName: 'Landing Card';
    icon: 'apps';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLinkGroup extends Struct.ComponentSchema {
  collectionName: 'components_shared_link_groups';
  info: {
    displayName: 'Link Group';
    icon: 'list';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    links: Schema.Attribute.Component<'shared.link-item', true>;
  };
}

export interface SharedLinkItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_link_items';
  info: {
    displayName: 'Link Item';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedPublication extends Struct.ComponentSchema {
  collectionName: 'components_shared_publications';
  info: {
    displayName: 'Publication';
    icon: 'file-text';
  };
  attributes: {
    citation: Schema.Attribute.Text & Schema.Attribute.Required;
    link: Schema.Attribute.String;
    year: Schema.Attribute.Integer;
  };
}

export interface SharedSectionCopy extends Struct.ComponentSchema {
  collectionName: 'components_shared_section_copies';
  info: {
    displayName: 'Section Text';
    icon: 'align-left';
  };
  attributes: {
    body: Schema.Attribute.Text;
    button_label: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    secondary_button_label: Schema.Attribute.String;
    tagline: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    description: Schema.Attribute.Text;
    og_image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social Link';
    icon: 'earth';
  };
  attributes: {
    platform: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStageDocument extends Struct.ComponentSchema {
  collectionName: 'components_shared_stage_documents';
  info: {
    displayName: 'Stage Document';
    icon: 'paperclip';
  };
  attributes: {
    date_posted: Schema.Attribute.Date;
    file: Schema.Attribute.Media<'files'>;
    label: Schema.Attribute.String;
    stage: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UnitsPoint extends Struct.ComponentSchema {
  collectionName: 'components_units_points';
  info: {
    description: 'A short item: a title and an optional line.';
    displayName: 'Point';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'about.core-value': AboutCoreValue;
      'about.mission-item': AboutMissionItem;
      'admission-guide.contact': AdmissionGuideContact;
      'admission-guide.fact': AdmissionGuideFact;
      'admission-guide.faq': AdmissionGuideFaq;
      'admission-guide.fee': AdmissionGuideFee;
      'admission-guide.info': AdmissionGuideInfo;
      'admission-guide.key-date': AdmissionGuideKeyDate;
      'admission-guide.page-labels': AdmissionGuidePageLabels;
      'admission-guide.requirement': AdmissionGuideRequirement;
      'admission-guide.route': AdmissionGuideRoute;
      'admission-guide.scholarship': AdmissionGuideScholarship;
      'admission.enquiry-option': AdmissionEnquiryOption;
      'announcements.position-opening': AnnouncementsPositionOpening;
      'announcements.shortlist-row': AnnouncementsShortlistRow;
      'announcements.written-exam-candidate': AnnouncementsWrittenExamCandidate;
      'contact.help-topic': ContactHelpTopic;
      'contact.page-labels': ContactPageLabels;
      'facilities.feature': FacilitiesFeature;
      'facilities.feature-block': FacilitiesFeatureBlock;
      'facilities.messages': FacilitiesMessages;
      'facilities.nav-link': FacilitiesNavLink;
      'facilities.section-directory': FacilitiesSectionDirectory;
      'facilities.section-gallery': FacilitiesSectionGallery;
      'facilities.section-index': FacilitiesSectionIndex;
      'facilities.section-laboratories': FacilitiesSectionLaboratories;
      'facilities.section-library': FacilitiesSectionLibrary;
      'facilities.section-links': FacilitiesSectionLinks;
      'home.campus': HomeCampus;
      'home.card': HomeCard;
      'home.events': HomeEvents;
      'home.highlights': HomeHighlights;
      'home.introduction': HomeIntroduction;
      'home.labels': HomeLabels;
      'home.link-cards': HomeLinkCards;
      'home.message': HomeMessage;
      'home.notices': HomeNotices;
      'home.programmes': HomeProgrammes;
      'home.research': HomeResearch;
      'home.resources': HomeResources;
      'home.stat': HomeStat;
      'home.stats': HomeStats;
      'navigation.nav-item': NavigationNavItem;
      'programme.curriculum-block': ProgrammeCurriculumBlock;
      'research.doc-link': ResearchDocLink;
      'research.facility': ResearchFacility;
      'research.grant': ResearchGrant;
      'research.journal': ResearchJournal;
      'research.journal-article': ResearchJournalArticle;
      'research.labels': ResearchLabels;
      'research.resource': ResearchResource;
      'sections.call-to-action': SectionsCallToAction;
      'sections.image-text': SectionsImageText;
      'sections.rich-text': SectionsRichText;
      'shared.attachment': SharedAttachment;
      'shared.button': SharedButton;
      'shared.contact-block': SharedContactBlock;
      'shared.contact-item': SharedContactItem;
      'shared.faq-item': SharedFaqItem;
      'shared.icon-card': SharedIconCard;
      'shared.landing-card': SharedLandingCard;
      'shared.link-group': SharedLinkGroup;
      'shared.link-item': SharedLinkItem;
      'shared.publication': SharedPublication;
      'shared.section-copy': SharedSectionCopy;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'shared.stage-document': SharedStageDocument;
      'units.point': UnitsPoint;
    }
  }
}
