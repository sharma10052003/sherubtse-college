import type { Schema, Struct } from '@strapi/strapi';

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

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'announcements.position-opening': AnnouncementsPositionOpening;
      'announcements.shortlist-row': AnnouncementsShortlistRow;
      'announcements.written-exam-candidate': AnnouncementsWrittenExamCandidate;
      'navigation.nav-item': NavigationNavItem;
      'programme.curriculum-block': ProgrammeCurriculumBlock;
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
    }
  }
}
