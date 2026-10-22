import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    adminPermissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::permission'
    >;
    adminUserOwner: Schema.Attribute.Relation<'manyToOne', 'admin::user'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    kind: Schema.Attribute.Enumeration<['content-api', 'admin']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'content-api'>;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    apiToken: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deviceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    metadata: Schema.Attribute.JSON & Schema.Attribute.Private;
    origin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    apiTokens: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordTokenExpiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAboutOverviewAboutOverview extends Struct.SingleTypeSchema {
  collectionName: 'about_overview';
  info: {
    displayName: 'About \u2013 Overview';
    pluralName: 'about-overviews';
    singularName: 'about-overview';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.landing-card', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eyebrow: Schema.Attribute.String;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    hero_image: Schema.Attribute.Media<'images'>;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::about-overview.about-overview'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.DynamicZone<
      ['sections.rich-text', 'sections.image-text', 'sections.call-to-action']
    >;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAboutPageAboutPage extends Struct.SingleTypeSchema {
  collectionName: 'about_page';
  info: {
    displayName: 'About \u2013 The College';
    pluralName: 'about-pages';
    singularName: 'about-page';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    contact_note: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'About the College'>;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::about-page.about-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo_description: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAcademicGuideAcademicGuide extends Struct.SingleTypeSchema {
  collectionName: 'academic_guide';
  info: {
    displayName: 'Academics \u2013 Guide';
    pluralName: 'academic-guides';
    singularName: 'academic-guide';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    guide_pdf: Schema.Attribute.Media<'files'> & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::academic-guide.academic-guide'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAcademicsOverviewAcademicsOverview
  extends Struct.SingleTypeSchema {
  collectionName: 'academics_overview';
  info: {
    displayName: 'Academics \u2013 Overview';
    pluralName: 'academics-overviews';
    singularName: 'academics-overview';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.landing-card', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eyebrow: Schema.Attribute.String;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::academics-overview.academics-overview'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.DynamicZone<
      ['sections.rich-text', 'sections.image-text', 'sections.call-to-action']
    >;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAdmissionBhutaneseAdmissionBhutanese
  extends Struct.SingleTypeSchema {
  collectionName: 'admission_bhutanese';
  info: {
    description: 'Everything on the Bhutanese applicants page (/admissions/bhutanese), in the same order as its tabs.';
    displayName: 'Admission \u2013 Bhutanese Applicants';
    pluralName: 'admission-bhutaneses';
    singularName: 'admission-bhutanese';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    application_routes: Schema.Attribute.Component<
      'admission-guide.route',
      true
    >;
    apply_intro: Schema.Attribute.RichText;
    card_description: Schema.Attribute.Text;
    card_title: Schema.Attribute.String & Schema.Attribute.Required;
    contacts: Schema.Attribute.Component<'admission-guide.contact', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    faqs: Schema.Attribute.Component<'admission-guide.faq', true>;
    fees: Schema.Attribute.Component<'admission-guide.fee', true>;
    fees_intro: Schema.Attribute.RichText;
    fees_note: Schema.Attribute.RichText;
    intro: Schema.Attribute.Text;
    key_facts: Schema.Attribute.Component<'admission-guide.fact', true>;
    links: Schema.Attribute.Component<'shared.link-item', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::admission-bhutanese.admission-bhutanese'
    > &
      Schema.Attribute.Private;
    more_info: Schema.Attribute.Component<'admission-guide.info', true>;
    publishedAt: Schema.Attribute.DateTime;
    required_documents: Schema.Attribute.Text;
    requirements: Schema.Attribute.Component<
      'admission-guide.requirement',
      true
    >;
    requirements_intro: Schema.Attribute.RichText;
    scholarships: Schema.Attribute.Component<
      'admission-guide.scholarship',
      true
    >;
    scholarships_intro: Schema.Attribute.RichText;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAdmissionEnquirySettingAdmissionEnquirySetting
  extends Struct.SingleTypeSchema {
  collectionName: 'admission_enquiry_setting';
  info: {
    description: 'Wording, fields and routing for the Admissions enquiry form.';
    displayName: 'Admission \u2013 Enquiry Form Settings';
    pluralName: 'admission-enquiry-settings';
    singularName: 'admission-enquiry-setting';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    applicant_category_label: Schema.Attribute.String;
    confirmation_message: Schema.Attribute.Text;
    consent_label: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    default_recipient_email: Schema.Attribute.Email;
    email_label: Schema.Attribute.String;
    enquiry_categories: Schema.Attribute.Component<
      'admission.enquiry-option',
      true
    >;
    enquiry_category_label: Schema.Attribute.String;
    error_message: Schema.Attribute.Text;
    introduction: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::admission-enquiry-setting.admission-enquiry-setting'
    > &
      Schema.Attribute.Private;
    message_label: Schema.Attribute.String;
    name_label: Schema.Attribute.String;
    phone_label: Schema.Attribute.String;
    phone_required: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    privacy_notice: Schema.Attribute.Text;
    privacy_policy_url: Schema.Attribute.String;
    programme_label: Schema.Attribute.String;
    programme_required: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    publishedAt: Schema.Attribute.DateTime;
    show_phone: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_programme: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    submit_label: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAdmissionEnquiryAdmissionEnquiry
  extends Struct.CollectionTypeSchema {
  collectionName: 'admission_enquiries';
  info: {
    description: 'Enquiries sent from the Admissions page. Mark \u201Creviewed\u201D once answered.';
    displayName: 'Admission \u2013 Enquiries';
    pluralName: 'admission-enquiries';
    singularName: 'admission-enquiry';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    applicant_category: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    consent: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    enquiry_category: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    full_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::admission-enquiry.admission-enquiry'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    phone: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    programme: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    reviewed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    routed_to: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAdmissionInternationalApplicantsAdmissionInternationalApplicants
  extends Struct.SingleTypeSchema {
  collectionName: 'admission_international_applicants';
  info: {
    description: 'Everything on the international applicants page (/admissions/international), in the same order as its tabs.';
    displayName: 'Admission \u2013 International Applicants';
    pluralName: 'admission-international-applicantss';
    singularName: 'admission-international-applicants';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    application_routes: Schema.Attribute.Component<
      'admission-guide.route',
      true
    >;
    apply_intro: Schema.Attribute.RichText;
    card_description: Schema.Attribute.Text;
    card_title: Schema.Attribute.String & Schema.Attribute.Required;
    contacts: Schema.Attribute.Component<'admission-guide.contact', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    faqs: Schema.Attribute.Component<'admission-guide.faq', true>;
    fees: Schema.Attribute.Component<'admission-guide.fee', true>;
    fees_intro: Schema.Attribute.RichText;
    fees_note: Schema.Attribute.RichText;
    intro: Schema.Attribute.Text;
    key_facts: Schema.Attribute.Component<'admission-guide.fact', true>;
    links: Schema.Attribute.Component<'shared.link-item', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::admission-international-applicants.admission-international-applicants'
    > &
      Schema.Attribute.Private;
    more_info: Schema.Attribute.Component<'admission-guide.info', true>;
    publishedAt: Schema.Attribute.DateTime;
    required_documents: Schema.Attribute.Text;
    requirements: Schema.Attribute.Component<
      'admission-guide.requirement',
      true
    >;
    requirements_intro: Schema.Attribute.RichText;
    scholarships: Schema.Attribute.Component<
      'admission-guide.scholarship',
      true
    >;
    scholarships_intro: Schema.Attribute.RichText;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAdmissionsOverviewAdmissionsOverview
  extends Struct.SingleTypeSchema {
  collectionName: 'admissions_overview';
  info: {
    description: 'The Admissions landing page (/admissions): hero, the two \u201CWho\u2019s applying?\u201D choices, key dates and notices. Each audience\u2019s details are in Admission \u2013 Bhutanese Applicants and Admission \u2013 International Applicants.';
    displayName: 'Admission \u2013 Page Settings';
    pluralName: 'admissions-overviews';
    singularName: 'admissions-overview';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    choose_heading: Schema.Attribute.String;
    choose_intro: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dates_heading: Schema.Attribute.String;
    dates_intro: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    help_heading: Schema.Attribute.String;
    help_intro: Schema.Attribute.Text;
    hero_image: Schema.Attribute.Media<'images'>;
    hero_image_alt: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    key_dates: Schema.Attribute.Component<'admission-guide.key-date', true>;
    labels: Schema.Attribute.Component<'admission-guide.page-labels', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::admissions-overview.admissions-overview'
    > &
      Schema.Attribute.Private;
    notices_heading: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    subtitle: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAlumniAchievementAlumniAchievement
  extends Struct.CollectionTypeSchema {
  collectionName: 'alumni_achievements';
  info: {
    displayName: 'Alumni \u2013 Achievements';
    pluralName: 'alumni-achievements';
    singularName: 'alumni-achievement';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alumni_name: Schema.Attribute.String & Schema.Attribute.Required;
    category: Schema.Attribute.Enumeration<
      [
        'award',
        'leadership',
        'research',
        'publication',
        'entrepreneurship',
        'community_service',
        'international',
        'professional_recognition',
      ]
    > &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alumni-achievement.alumni-achievement'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiAlumniChapterAlumniChapter
  extends Struct.CollectionTypeSchema {
  collectionName: 'alumni_chapters';
  info: {
    displayName: 'Alumni \u2013 Chapters';
    pluralName: 'alumni-chapters';
    singularName: 'alumni-chapter';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contact_email: Schema.Attribute.String;
    country: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alumni-chapter.alumni-chapter'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    sort_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAlumniGalleryImageAlumniGalleryImage
  extends Struct.CollectionTypeSchema {
  collectionName: 'alumni_gallery_images';
  info: {
    displayName: 'Alumni \u2013 Gallery';
    pluralName: 'alumni-gallery-images';
    singularName: 'alumni-gallery-image';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    caption: Schema.Attribute.String;
    category: Schema.Attribute.Enumeration<
      [
        'old_sherubtse',
        'campus_memories',
        'student_life',
        'graduation',
        'alumni_reunions',
        'college_events',
        'historical_moments',
      ]
    > &
      Schema.Attribute.DefaultTo<'campus_memories'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alumni-gallery-image.alumni-gallery-image'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sort_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAlumniRegistrationAlumniRegistration
  extends Struct.CollectionTypeSchema {
  collectionName: 'alumni_registrations';
  info: {
    displayName: 'Alumni \u2013 Registrations';
    pluralName: 'alumni-registrations';
    singularName: 'alumni-registration';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    academic_period: Schema.Attribute.String;
    city: Schema.Attribute.String;
    consent_directory: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    country: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    designation: Schema.Attribute.String;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    full_name: Schema.Attribute.String & Schema.Attribute.Required;
    graduation_year: Schema.Attribute.Integer;
    industry: Schema.Attribute.String;
    interests: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alumni-registration.alumni-registration'
    > &
      Schema.Attribute.Private;
    organization: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    programme: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    reviewed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAlumniSettingAlumniSetting extends Struct.SingleTypeSchema {
  collectionName: 'alumni_settings';
  info: {
    displayName: 'Alumni \u2013 Page';
    pluralName: 'alumni-settings';
    singularName: 'alumni-setting';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    about: Schema.Attribute.Component<'shared.section-copy', false>;
    achievements: Schema.Attribute.Component<'shared.section-copy', false>;
    contact: Schema.Attribute.Component<'shared.section-copy', false>;
    contact_items: Schema.Attribute.Component<'shared.contact-item', true>;
    countries_represented: Schema.Attribute.Integer;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    distinguished: Schema.Attribute.Component<'shared.section-copy', false>;
    error_message: Schema.Attribute.String;
    events: Schema.Attribute.Component<'shared.section-copy', false>;
    gallery: Schema.Attribute.Component<'shared.section-copy', false>;
    global_reach: Schema.Attribute.Component<'shared.section-copy', false>;
    hero: Schema.Attribute.Component<'shared.section-copy', false>;
    hero_background: Schema.Attribute.Media<'images' | 'videos'>;
    label_alumni: Schema.Attribute.String;
    label_chapters: Schema.Attribute.String;
    label_countries: Schema.Attribute.String;
    label_gallery_all: Schema.Attribute.String;
    label_past_events: Schema.Attribute.String;
    label_stories: Schema.Attribute.String;
    label_total_alumni: Schema.Attribute.String;
    label_upcoming_events: Schema.Attribute.String;
    label_years: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alumni-setting.alumni-setting'
    > &
      Schema.Attribute.Private;
    matters: Schema.Attribute.Component<'shared.section-copy', false>;
    matters_cards: Schema.Attribute.Component<'shared.icon-card', true>;
    mentorship: Schema.Attribute.Component<'shared.section-copy', false>;
    newsletter: Schema.Attribute.Component<'shared.section-copy', false>;
    newsletter_already_message: Schema.Attribute.String;
    newsletter_placeholder: Schema.Attribute.String;
    newsletter_success_message: Schema.Attribute.String;
    past_empty_text: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    register: Schema.Attribute.Component<'shared.section-copy', false>;
    register_consent_text: Schema.Attribute.Text;
    register_success_message: Schema.Attribute.Text;
    seo_description: Schema.Attribute.Text;
    show_achievements: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    show_chapters: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_events: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_gallery: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_newsletter: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    show_statistics: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    stories: Schema.Attribute.Component<'shared.section-copy', false>;
    stories_empty_text: Schema.Attribute.String;
    story_consent_text: Schema.Attribute.Text;
    story_form: Schema.Attribute.Component<'shared.section-copy', false>;
    story_success_message: Schema.Attribute.Text;
    total_alumni_override: Schema.Attribute.Integer;
    upcoming_empty_text: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    years_of_legacy: Schema.Attribute.Integer;
  };
}

export interface ApiAlumniAlumni extends Struct.CollectionTypeSchema {
  collectionName: 'alumni_profiles';
  info: {
    displayName: 'Alumni \u2013 Profiles & Stories';
    pluralName: 'alumnis';
    singularName: 'alumni';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    article_title: Schema.Attribute.String;
    category: Schema.Attribute.Enumeration<
      [
        'sherubtse_journey',
        'career_journey',
        'student_memories',
        'leadership',
        'entrepreneurship',
        'research',
        'community_service',
        'international_journey',
      ]
    >;
    consent: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    country: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    current_role: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    excerpt: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 280;
      }>;
    full_name: Schema.Attribute.String & Schema.Attribute.Required;
    graduation_year: Schema.Attribute.Integer;
    is_featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alumni.alumni'
    > &
      Schema.Attribute.Private;
    organization: Schema.Attribute.String;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    photo: Schema.Attribute.Media<'images'>;
    programme: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'full_name'>;
    story: Schema.Attribute.RichText;
    supporting_images: Schema.Attribute.Media<'images', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAnnouncementAnnouncement
  extends Struct.CollectionTypeSchema {
  collectionName: 'announcements';
  info: {
    description: 'Short announcements, warnings and urgent notices \u2014 shown on the Announcements page and the homepage while active and inside their start/end dates.';
    displayName: 'News & Notices \u2013 Announcements';
    pluralName: 'announcements';
    singularName: 'announcement';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    announcement_type: Schema.Attribute.Enumeration<
      ['info', 'success', 'warning', 'danger', 'primary']
    > &
      Schema.Attribute.DefaultTo<'info'>;
    background_color: Schema.Attribute.String;
    content: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    end_date: Schema.Attribute.DateTime;
    icon: Schema.Attribute.String;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    is_scrolling: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    link_text: Schema.Attribute.String;
    link_url: Schema.Attribute.String;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::announcement.announcement'
    >;
    priority: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    start_date: Schema.Attribute.DateTime;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAwardAward extends Struct.CollectionTypeSchema {
  collectionName: 'awards';
  info: {
    displayName: 'About \u2013 Faculty Awards';
    pluralName: 'awards';
    singularName: 'award';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    award_name: Schema.Attribute.String & Schema.Attribute.Required;
    certificate: Schema.Attribute.Media<'files' | 'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    faculty: Schema.Attribute.Relation<
      'manyToOne',
      'api::faculty-profile.faculty-profile'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::award.award'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.Integer;
  };
}

export interface ApiCalendarEntryCalendarEntry
  extends Struct.CollectionTypeSchema {
  collectionName: 'calendar_entries';
  info: {
    displayName: 'Academics \u2013 Calendar Entries';
    pluralName: 'calendar-entries';
    singularName: 'calendar-entry';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    applies_to_programmes: Schema.Attribute.Relation<
      'manyToMany',
      'api::programme.programme'
    >;
    category: Schema.Attribute.Enumeration<
      [
        'registration',
        'examination',
        'results',
        'fee',
        'holiday',
        'convocation',
      ]
    > &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ends_on: Schema.Attribute.Date;
    expires_at: Schema.Attribute.DateTime;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::calendar-entry.calendar-entry'
    > &
      Schema.Attribute.Private;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    related_announcement: Schema.Attribute.Relation<
      'manyToOne',
      'api::notice.notice'
    >;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    starts_on: Schema.Attribute.Date & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiClubClub extends Struct.CollectionTypeSchema {
  collectionName: 'clubs';
  info: {
    displayName: 'Student Life \u2013 Clubs';
    pluralName: 'clubs';
    singularName: 'club';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.String;
    coordinator: Schema.Attribute.Relation<'oneToOne', 'api::person.person'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    expires_at: Schema.Attribute.DateTime;
    images: Schema.Attribute.Media<'images', true>;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::club.club'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    slug: Schema.Attribute.UID<'name'>;
    student_lead: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactEnquiryContactEnquiry
  extends Struct.CollectionTypeSchema {
  collectionName: 'contact_enquiries';
  info: {
    displayName: 'Contact \u2013 Enquiries';
    pluralName: 'contact-enquiries';
    singularName: 'contact-enquiry';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    department: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    full_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-enquiry.contact-enquiry'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    office_email: Schema.Attribute.Email;
    phone: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    publishedAt: Schema.Attribute.DateTime;
    reviewed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    subject: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactPageContentContactPageContent
  extends Struct.SingleTypeSchema {
  collectionName: 'contact_page_content';
  info: {
    displayName: 'Contact \u2013 Page';
    pluralName: 'contact-page-contents';
    singularName: 'contact-page-content';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    call_button_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    campus_map_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    campus_map_url: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    directions_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    email_button_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    enquiry_heading: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    enquiry_intro: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    form_department_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    form_department_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    form_email_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    form_error_message: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    form_message_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    form_name_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    form_other_department: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    form_phone_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    form_subject_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    form_submit_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    form_success_message: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    general_email: Schema.Attribute.Email;
    general_phone: Schema.Attribute.String;
    help_heading: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    help_intro: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    help_topics: Schema.Attribute.Component<'contact.help-topic', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero_eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Get in Touch'>;
    hero_image: Schema.Attribute.Media<'images'>;
    hero_subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero_title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Contact Us'>;
    ict_button_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ict_button_link: Schema.Attribute.String;
    ict_card_button_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ict_email_subject: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ict_heading: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ict_text: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    info_heading: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    info_subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    labels: Schema.Attribute.Component<'contact.page-labels', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-page-content.contact-page-content'
    >;
    map_heading: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    map_intro: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    map_place_name: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    map_url: Schema.Attribute.String;
    office_hours: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    offices_heading: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    offices_intro: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    page_title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Contact Us'>;
    publishedAt: Schema.Attribute.DateTime;
    quick_directions_text: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    quick_directions_title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    quick_enquiry_text: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    quick_enquiry_title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    quick_find_text: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    quick_find_title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    search_empty_message: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    search_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    search_placeholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seo_description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    spotlight_enquiry_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    spotlight_other_office_label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiContactPersonContactPerson
  extends Struct.CollectionTypeSchema {
  collectionName: 'contact_people';
  info: {
    displayName: 'Contact \u2013 Offices';
    pluralName: 'contact-people';
    singularName: 'contact-person';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bio: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    email: Schema.Attribute.Email;
    full_name: Schema.Attribute.String;
    group_description: Schema.Attribute.Text;
    group_icon: Schema.Attribute.Enumeration<
      ['president', 'academic', 'student', 'research', 'admin', 'ict', 'exam']
    > &
      Schema.Attribute.DefaultTo<'admin'>;
    group_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    group_title: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-person.contact-person'
    > &
      Schema.Attribute.Private;
    office_location: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images'>;
    publishedAt: Schema.Attribute.DateTime;
    role_title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiDepartmentDepartment extends Struct.CollectionTypeSchema {
  collectionName: 'departments';
  info: {
    displayName: 'Academics \u2013 Departments';
    pluralName: 'departments';
    singularName: 'department';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    animation_enabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    animation_intensity: Schema.Attribute.Enumeration<
      ['low', 'medium', 'high']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    animation_speed: Schema.Attribute.Enumeration<['slow', 'normal', 'fast']> &
      Schema.Attribute.DefaultTo<'normal'>;
    animation_type: Schema.Attribute.Enumeration<
      ['network-data', 'particles-math', 'flowing-gradient', 'none']
    > &
      Schema.Attribute.DefaultTo<'flowing-gradient'>;
    banner_image: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    department_logo: Schema.Attribute.Media<'images'>;
    department_name: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    faculty_members: Schema.Attribute.Relation<
      'oneToMany',
      'api::faculty-profile.faculty-profile'
    >;
    faculty_name: Schema.Attribute.String;
    head_of_department: Schema.Attribute.Relation<
      'oneToOne',
      'api::faculty-profile.faculty-profile'
    >;
    hero_video: Schema.Attribute.Media<'videos'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::department.department'
    > &
      Schema.Attribute.Private;
    mission: Schema.Attribute.Text;
    mobile_background: Schema.Attribute.Media<'images'>;
    overlay_opacity: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<60>;
    programmes: Schema.Attribute.Relation<
      'oneToMany',
      'api::programme.programme'
    >;
    publishedAt: Schema.Attribute.DateTime;
    seo_description: Schema.Attribute.Text;
    seo_title: Schema.Attribute.String;
    short_description: Schema.Attribute.Text;
    slug: Schema.Attribute.UID<'department_name'>;
    theme_color: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    vision: Schema.Attribute.Text;
  };
}

export interface ApiDocumentDocument extends Struct.CollectionTypeSchema {
  collectionName: 'documents';
  info: {
    displayName: 'News & Notices \u2013 Downloads & Forms';
    pluralName: 'documents';
    singularName: 'document';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      ['policy', 'form', 'timetable', 'guide', 'report', 'other']
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    effective_date: Schema.Attribute.Date;
    expires_at: Schema.Attribute.DateTime;
    file: Schema.Attribute.Media<'files'> & Schema.Attribute.Required;
    is_current: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::document.document'
    > &
      Schema.Attribute.Private;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    review_date: Schema.Attribute.Date;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    source_note: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    version: Schema.Attribute.String;
  };
}

export interface ApiEventEvent extends Struct.CollectionTypeSchema {
  collectionName: 'events';
  info: {
    displayName: 'News & Notices \u2013 Events';
    pluralName: 'events';
    singularName: 'event';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      [
        'academic',
        'conference',
        'workshop',
        'seminar',
        'student_activity',
        'sports',
        'cultural',
        'public_lecture',
        'career',
        'meeting',
        'other',
      ]
    > &
      Schema.Attribute.DefaultTo<'other'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    ends_at: Schema.Attribute.DateTime;
    expires_at: Schema.Attribute.DateTime & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    is_featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::event.event'> &
      Schema.Attribute.Private;
    open_to: Schema.Attribute.Enumeration<
      ['public', 'students', 'staff', 'invited']
    >;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    photo_story: Schema.Attribute.Relation<'oneToOne', 'api::news.news'>;
    publishedAt: Schema.Attribute.DateTime;
    registration_link: Schema.Attribute.String;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    starts_at: Schema.Attribute.DateTime & Schema.Attribute.Required;
    summary: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    venue: Schema.Attribute.String;
  };
}

export interface ApiExpertiseExpertise extends Struct.CollectionTypeSchema {
  collectionName: 'expertise_areas';
  info: {
    displayName: 'About \u2013 Faculty Expertise';
    pluralName: 'expertises';
    singularName: 'expertise';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::expertise.expertise'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFacilitiesPageFacilitiesPage
  extends Struct.SingleTypeSchema {
  collectionName: 'facilities_page';
  info: {
    description: 'The Campus Facilities page: hero, quick navigation, the Library and Laboratories features, empty-state text, SEO and the order of sections.';
    displayName: 'About \u2013 Campus Facilities: Page Settings';
    pluralName: 'facilities-pages';
    singularName: 'facilities-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eyebrow: Schema.Attribute.String;
    hero_caption: Schema.Attribute.String;
    hero_image_alt: Schema.Attribute.String;
    hero_images: Schema.Attribute.Media<'images', true>;
    intro: Schema.Attribute.Text;
    laboratories: Schema.Attribute.Component<'facilities.feature-block', false>;
    library: Schema.Attribute.Component<'facilities.feature-block', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::facilities-page.facilities-page'
    > &
      Schema.Attribute.Private;
    messages: Schema.Attribute.Component<'facilities.messages', false>;
    publishedAt: Schema.Attribute.DateTime;
    quick_nav: Schema.Attribute.Component<'facilities.nav-link', true>;
    sections: Schema.Attribute.DynamicZone<
      [
        'facilities.section-index',
        'facilities.section-library',
        'facilities.section-laboratories',
        'facilities.section-directory',
        'facilities.section-gallery',
        'facilities.section-links',
        'sections.rich-text',
        'sections.image-text',
        'sections.call-to-action',
      ]
    >;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFacilityCategoryFacilityCategory
  extends Struct.CollectionTypeSchema {
  collectionName: 'facility_categories';
  info: {
    description: 'Filter categories for the facility directory and gallery. Inactive categories are hidden.';
    displayName: 'About \u2013 Campus Facilities: Categories';
    pluralName: 'facility-categories';
    singularName: 'facility-category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
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
    image: Schema.Attribute.Media<'images'>;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::facility-category.facility-category'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFacilityGalleryImageFacilityGalleryImage
  extends Struct.CollectionTypeSchema {
  collectionName: 'facility_gallery_images';
  info: {
    description: 'Real Sherubtse photographs for the Campus Gallery. Always add alternative text.';
    displayName: 'About \u2013 Campus Facilities: Gallery';
    pluralName: 'facility-gallery-images';
    singularName: 'facility-gallery-image';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    alt_text: Schema.Attribute.String & Schema.Attribute.Required;
    caption: Schema.Attribute.String;
    category: Schema.Attribute.Relation<
      'manyToOne',
      'api::facility-category.facility-category'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    facility: Schema.Attribute.Relation<'manyToOne', 'api::facility.facility'>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    is_featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::facility-gallery-image.facility-gallery-image'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFacilityQuickLinkFacilityQuickLink
  extends Struct.CollectionTypeSchema {
  collectionName: 'facility_quick_links';
  info: {
    description: 'Useful facility links. Only add destinations that have been checked.';
    displayName: 'About \u2013 Campus Facilities: Quick Links';
    pluralName: 'facility-quick-links';
    singularName: 'facility-quick-link';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
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
      Schema.Attribute.DefaultTo<'link'>;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    link_type: Schema.Attribute.Enumeration<['internal', 'external']> &
      Schema.Attribute.DefaultTo<'external'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::facility-quick-link.facility-quick-link'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ApiFacilityFacility extends Struct.CollectionTypeSchema {
  collectionName: 'facilities';
  info: {
    description: 'One verified campus facility, shown as a numbered story on Campus Facilities. Only publish confirmed information.';
    displayName: 'About \u2013 Campus Facilities: Facilities';
    pluralName: 'facilities';
    singularName: 'facility';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    access_conditions: Schema.Attribute.Text;
    accessibility: Schema.Attribute.Text;
    building: Schema.Attribute.String;
    categories: Schema.Attribute.Relation<
      'manyToMany',
      'api::facility-category.facility-category'
    >;
    contact: Schema.Attribute.Relation<
      'manyToOne',
      'api::contact-person.contact-person'
    >;
    contact_note: Schema.Attribute.String;
    content: Schema.Attribute.RichText;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    department: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'>;
    display_mode: Schema.Attribute.Enumeration<['page', 'panel', 'card_only']> &
      Schema.Attribute.DefaultTo<'panel'>;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    documents: Schema.Attribute.Component<'shared.attachment', true>;
    features: Schema.Attribute.Component<'facilities.feature', true>;
    image_alt: Schema.Attribute.String;
    images: Schema.Attribute.Media<'images', true>;
    is_featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    links: Schema.Attribute.Component<'shared.link-item', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::facility.facility'
    > &
      Schema.Attribute.Private;
    location: Schema.Attribute.String;
    main_image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    opening_hours: Schema.Attribute.String;
    policies: Schema.Attribute.RichText;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    summary: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 280;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    uses: Schema.Attribute.RichText;
  };
}

export interface ApiFacultyProfileFacultyProfile
  extends Struct.CollectionTypeSchema {
  collectionName: 'faculty_profiles';
  info: {
    displayName: 'About \u2013 Faculty Profiles';
    pluralName: 'faculty-profiles';
    singularName: 'faculty-profile';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    awards: Schema.Attribute.Relation<'oneToMany', 'api::award.award'>;
    college_email: Schema.Attribute.String;
    conference_images: Schema.Attribute.Media<'images', true>;
    cover_image: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date_joined: Schema.Attribute.Date;
    department: Schema.Attribute.Relation<
      'manyToOne',
      'api::department.department'
    >;
    department_event_photos: Schema.Attribute.Media<'images', true>;
    employee_id: Schema.Attribute.String;
    employment_status: Schema.Attribute.Enumeration<['active', 'inactive']> &
      Schema.Attribute.DefaultTo<'active'>;
    full_name: Schema.Attribute.String & Schema.Attribute.Required;
    google_maps_link: Schema.Attribute.String;
    google_scholar_url: Schema.Attribute.String;
    highest_qualification: Schema.Attribute.String;
    is_featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    languages: Schema.Attribute.Text;
    linkedin_url: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::faculty-profile.faculty-profile'
    > &
      Schema.Attribute.Private;
    office_hours: Schema.Attribute.Text;
    office_location: Schema.Attribute.String;
    orcid_url: Schema.Attribute.String;
    personal_email: Schema.Attribute.String;
    personal_website_url: Schema.Attribute.String;
    phone_number: Schema.Attribute.String;
    position: Schema.Attribute.String;
    profile_picture: Schema.Attribute.Media<'images'>;
    publications: Schema.Attribute.Relation<
      'oneToMany',
      'api::research-publication.research-publication'
    >;
    publishedAt: Schema.Attribute.DateTime;
    research_areas: Schema.Attribute.Text;
    research_photos: Schema.Attribute.Media<'images', true>;
    researchgate_url: Schema.Attribute.String;
    short_biography: Schema.Attribute.Text;
    slug: Schema.Attribute.UID<'full_name'> & Schema.Attribute.Required;
    sort_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    specialization: Schema.Attribute.String;
    teaching_subjects: Schema.Attribute.Text;
    university: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    work_experience: Schema.Attribute.Text;
    workshop_photos: Schema.Attribute.Media<'images', true>;
  };
}

export interface ApiFacultySettingFacultySetting
  extends Struct.SingleTypeSchema {
  collectionName: 'faculty_settings';
  info: {
    displayName: 'About \u2013 Faculty Page';
    pluralName: 'faculty-settings';
    singularName: 'faculty-setting';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    animation_style: Schema.Attribute.Enumeration<
      ['fade', 'slide', 'zoom', 'none']
    > &
      Schema.Attribute.DefaultTo<'fade'>;
    button_style: Schema.Attribute.Enumeration<
      ['solid', 'outline', 'gradient']
    > &
      Schema.Attribute.DefaultTo<'solid'>;
    card_style: Schema.Attribute.Enumeration<['rounded', 'sharp', 'bordered']> &
      Schema.Attribute.DefaultTo<'rounded'>;
    cards_per_row: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    default_banner: Schema.Attribute.Media<'images'>;
    hero_background: Schema.Attribute.Media<'images' | 'videos'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::faculty-setting.faculty-setting'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    show_awards: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_contact: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_gallery: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_office_hours: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    show_publications: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    show_research: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_statistics: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    student_count: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFeatureFeature extends Struct.CollectionTypeSchema {
  collectionName: 'features';
  info: {
    displayName: 'News & Notices \u2013 Features';
    pluralName: 'features';
    singularName: 'feature';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    author: Schema.Attribute.Relation<'manyToOne', 'api::person.person'>;
    author_name: Schema.Attribute.String;
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    hero_image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::feature.feature'
    > &
      Schema.Attribute.Private;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    related_people: Schema.Attribute.Relation<
      'manyToMany',
      'api::person.person'
    >;
    related_units: Schema.Attribute.Relation<'manyToMany', 'api::unit.unit'>;
    slug: Schema.Attribute.UID<'title'>;
    standfirst: Schema.Attribute.Text & Schema.Attribute.Required;
    theme: Schema.Attribute.Enumeration<
      ['research', 'student_life', 'alumni', 'campus', 'history', 'people']
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiFooterFooter extends Struct.SingleTypeSchema {
  collectionName: 'footer';
  info: {
    displayName: 'Global \u2013 Footer';
    pluralName: 'footers';
    singularName: 'footer';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bottom_links: Schema.Attribute.Component<'shared.link-item', true>;
    contact_heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Contact'>;
    copyright_text: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    link_groups: Schema.Attribute.Component<'shared.link-group', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::footer.footer'
    > &
      Schema.Attribute.Private;
    motto: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    tagline: Schema.Attribute.Text;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHistoryContentHistoryContent
  extends Struct.SingleTypeSchema {
  collectionName: 'history_content';
  info: {
    displayName: 'About \u2013 History Page';
    pluralName: 'history-contents';
    singularName: 'history-content';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    brochure: Schema.Attribute.Media<'files'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    emblem_meaning: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    founding_story: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero_image: Schema.Attribute.Media<'images'>;
    hero_image_position: Schema.Attribute.Enumeration<
      ['top', 'center', 'bottom']
    > &
      Schema.Attribute.DefaultTo<'top'>;
    hero_intro: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero_subtitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero_title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    king_photo: Schema.Attribute.Media<'images'>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::history-content.history-content'
    >;
    mackey_bio: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    mackey_name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    mackey_photo: Schema.Attribute.Media<'images'>;
    motto: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    motto_meaning: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    now_image: Schema.Attribute.Media<'images'>;
    publishedAt: Schema.Attribute.DateTime;
    then_image: Schema.Attribute.Media<'images'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    values_text: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    video_url: Schema.Attribute.String;
    vision_king_text: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ApiHistoryGalleryImageHistoryGalleryImage
  extends Struct.CollectionTypeSchema {
  collectionName: 'history_gallery_images';
  info: {
    displayName: 'About \u2013 History Gallery';
    pluralName: 'history-gallery-images';
    singularName: 'history-gallery-image';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    caption: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    category: Schema.Attribute.Enumeration<
      [
        'campus',
        'students',
        'construction',
        'events',
        'festivals',
        'graduation',
      ]
    > &
      Schema.Attribute.DefaultTo<'campus'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::history-gallery-image.history-gallery-image'
    >;
    publishedAt: Schema.Attribute.DateTime;
    sort_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHistoryLegacyItemHistoryLegacyItem
  extends Struct.CollectionTypeSchema {
  collectionName: 'history_legacy_items';
  info: {
    displayName: 'About \u2013 History Legacy';
    pluralName: 'history-legacy-items';
    singularName: 'history-legacy-item';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::history-legacy-item.history-legacy-item'
    >;
    publishedAt: Schema.Attribute.DateTime;
    sort_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHistoryTimelineItemHistoryTimelineItem
  extends Struct.CollectionTypeSchema {
  collectionName: 'history_timeline_items';
  info: {
    displayName: 'About \u2013 History Timeline';
    pluralName: 'history-timeline-items';
    singularName: 'history-timeline-item';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    event: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::history-timeline-item.history-timeline-item'
    >;
    publishedAt: Schema.Attribute.DateTime;
    sort_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ApiHistoryTraditionItemHistoryTraditionItem
  extends Struct.CollectionTypeSchema {
  collectionName: 'history_tradition_items';
  info: {
    displayName: 'About \u2013 History Traditions';
    pluralName: 'history-tradition-items';
    singularName: 'history-tradition-item';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::history-tradition-item.history-tradition-item'
    >;
    publishedAt: Schema.Attribute.DateTime;
    sort_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiHomepageHomepage extends Struct.SingleTypeSchema {
  collectionName: 'homepage';
  info: {
    description: 'The homepage: the hero at the top, then the sections in the order listed under \u201CSections\u201D.';
    displayName: 'Home \u2013 Page';
    pluralName: 'homepages';
    singularName: 'homepage';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    hero_align: Schema.Attribute.Enumeration<['left', 'center']> &
      Schema.Attribute.DefaultTo<'left'>;
    hero_badge: Schema.Attribute.String;
    hero_buttons: Schema.Attribute.Component<'shared.link-item', true>;
    hero_eyebrow: Schema.Attribute.String;
    hero_heading: Schema.Attribute.String;
    hero_image_alt: Schema.Attribute.String;
    hero_images: Schema.Attribute.Media<'images', true>;
    hero_overlay: Schema.Attribute.Enumeration<['light', 'medium', 'strong']> &
      Schema.Attribute.DefaultTo<'medium'>;
    hero_video: Schema.Attribute.Media<'videos'>;
    hero_video_on_phones: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    labels: Schema.Attribute.Component<'home.labels', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::homepage.homepage'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.DynamicZone<
      [
        'home.highlights',
        'home.notices',
        'home.events',
        'home.introduction',
        'home.message',
        'home.programmes',
        'home.research',
        'home.campus',
        'home.stats',
        'home.resources',
        'home.link-cards',
        'sections.rich-text',
        'sections.image-text',
        'sections.call-to-action',
      ]
    >;
    seo_description: Schema.Attribute.Text;
    seo_title: Schema.Attribute.String;
    show_ticker: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    statement: Schema.Attribute.Text;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLeadershipMemberLeadershipMember
  extends Struct.CollectionTypeSchema {
  collectionName: 'leadership_members';
  info: {
    displayName: 'About \u2013 Leadership';
    pluralName: 'leadership-members';
    singularName: 'leadership-member';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    category: Schema.Attribute.Enumeration<['president', 'dean']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'dean'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    full_name: Schema.Attribute.String & Schema.Attribute.Required;
    honorific: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::leadership-member.leadership-member'
    > &
      Schema.Attribute.Private;
    photo: Schema.Attribute.Media<'images'>;
    publishedAt: Schema.Attribute.DateTime;
    role_title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNavigationNavigation extends Struct.SingleTypeSchema {
  collectionName: 'navigation';
  info: {
    displayName: 'Global \u2013 Header & Navigation';
    pluralName: 'navigations';
    singularName: 'navigation';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::navigation.navigation'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images'>;
    logo_alt: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Sherubtse College'>;
    menu: Schema.Attribute.Component<'navigation.nav-item', true>;
    menu_button_label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Menu'>;
    publishedAt: Schema.Attribute.DateTime;
    search_placeholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Search'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewsNoticesOverviewNewsNoticesOverview
  extends Struct.SingleTypeSchema {
  collectionName: 'news_notices_overview';
  info: {
    displayName: 'News & Notices \u2013 Overview';
    pluralName: 'news-notices-overviews';
    singularName: 'news-notices-overview';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.landing-card', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eyebrow: Schema.Attribute.String;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::news-notices-overview.news-notices-overview'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.DynamicZone<
      ['sections.rich-text', 'sections.image-text', 'sections.call-to-action']
    >;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewsNews extends Struct.CollectionTypeSchema {
  collectionName: 'news_entries';
  info: {
    displayName: 'News & Notices \u2013 News';
    pluralName: 'news-entries';
    singularName: 'news';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    archived: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    archived_at: Schema.Attribute.DateTime;
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    category: Schema.Attribute.Enumeration<
      [
        'campus_life',
        'academics',
        'research',
        'achievements',
        'events',
        'sports',
        'administration',
        'general',
        'celebrations',
        'culture',
        'workshops',
        'conferences',
        'visits',
        'awards',
        'graduation',
        'community',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'general'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    expires_at: Schema.Attribute.DateTime;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    gallery: Schema.Attribute.Media<'images', true>;
    hero_media_type: Schema.Attribute.Enumeration<['image', 'video']> &
      Schema.Attribute.DefaultTo<'image'>;
    images: Schema.Attribute.Media<'images', true>;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::news.news'> &
      Schema.Attribute.Private;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    photo_credit: Schema.Attribute.String;
    pinned: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    publish_at: Schema.Attribute.DateTime;
    publishedAt: Schema.Attribute.DateTime;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    show_on_homepage: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    summary: Schema.Attribute.Text & Schema.Attribute.Required;
    tags: Schema.Attribute.String;
    template: Schema.Attribute.Enumeration<
      [
        'standard',
        'featured',
        'video',
        'photo_story',
        'split',
        'gallery',
        'magazine',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'standard'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    video_file: Schema.Attribute.Media<'videos'>;
    video_poster: Schema.Attribute.Media<'images'>;
    video_url: Schema.Attribute.String;
  };
}

export interface ApiNewsletterSubscriberNewsletterSubscriber
  extends Struct.CollectionTypeSchema {
  collectionName: 'newsletter_subscribers';
  info: {
    displayName: 'Newsletter \u2013 Subscribers';
    pluralName: 'newsletter-subscribers';
    singularName: 'newsletter-subscriber';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    consent: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::newsletter-subscriber.newsletter-subscriber'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewsletterTopicNewsletterTopic
  extends Struct.CollectionTypeSchema {
  collectionName: 'newsletter_topics_list';
  info: {
    displayName: 'Newsletter \u2013 Topics';
    pluralName: 'newsletter-topics';
    singularName: 'newsletter-topic';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::newsletter-topic.newsletter-topic'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewsletterNewsletter extends Struct.CollectionTypeSchema {
  collectionName: 'newsletters';
  info: {
    displayName: 'Newsletter \u2013 Editions';
    pluralName: 'newsletters';
    singularName: 'newsletter';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    closing_message: Schema.Attribute.String;
    cover_image: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    download_count: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    edition: Schema.Attribute.Enumeration<
      ['spring', 'summer', 'autumn', 'winter']
    > &
      Schema.Attribute.Required;
    is_featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::newsletter.newsletter'
    > &
      Schema.Attribute.Private;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    pdf: Schema.Attribute.Media<'files'> & Schema.Attribute.Required;
    publication_date: Schema.Attribute.Date;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'The Tower'>;
    topics: Schema.Attribute.Relation<
      'manyToMany',
      'api::newsletter-topic.newsletter-topic'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    view_count: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    year: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface ApiNoticeNotice extends Struct.CollectionTypeSchema {
  collectionName: 'notices';
  info: {
    description: 'All notices. Admission notices are notices with category \u201CAdmissions\u201D \u2014 they appear on the Admissions page and in Announcements. Publication date and application closing date are separate fields.';
    displayName: 'News & Notices \u2013 Notices (incl. Admission Notices)';
    pluralName: 'notices';
    singularName: 'notice';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    admission_audience: Schema.Attribute.Enumeration<
      ['all', 'bhutanese', 'international']
    > &
      Schema.Attribute.DefaultTo<'all'>;
    application_closes: Schema.Attribute.Date;
    application_opens: Schema.Attribute.Date;
    attachments: Schema.Attribute.Component<'shared.attachment', true>;
    audience: Schema.Attribute.JSON;
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    category: Schema.Attribute.Enumeration<
      ['admissions', 'registration', 'results', 'fees', 'tender', 'general']
    > &
      Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    expires_at: Schema.Attribute.DateTime & Schema.Attribute.Required;
    featured_for_international: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    intake: Schema.Attribute.String;
    is_archived: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    is_featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::notice.notice'
    > &
      Schema.Attribute.Private;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    programmes: Schema.Attribute.Relation<
      'manyToMany',
      'api::programme.programme'
    >;
    publish_at: Schema.Attribute.DateTime & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    summary: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    urgency: Schema.Attribute.Enumeration<['normal', 'urgent']> &
      Schema.Attribute.DefaultTo<'normal'>;
  };
}

export interface ApiPagePage extends Struct.CollectionTypeSchema {
  collectionName: 'pages';
  info: {
    displayName: 'About \u2013 Text Pages';
    pluralName: 'pages';
    singularName: 'page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::page.page'> &
      Schema.Attribute.Private;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPersonPerson extends Struct.CollectionTypeSchema {
  collectionName: 'people';
  info: {
    displayName: 'About \u2013 People Directory';
    pluralName: 'people';
    singularName: 'person';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bio: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    contact_consent: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    designation: Schema.Attribute.String & Schema.Attribute.Required;
    email: Schema.Attribute.String;
    employment_status: Schema.Attribute.Enumeration<
      ['active', 'on_leave', 'departed']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'active'>;
    full_name: Schema.Attribute.String & Schema.Attribute.Required;
    honorific: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::person.person'
    > &
      Schema.Attribute.Private;
    phone: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images'>;
    photo_consent: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    photo_consent_date: Schema.Attribute.Date;
    publications: Schema.Attribute.Component<'shared.publication', true>;
    publishedAt: Schema.Attribute.DateTime;
    qualification: Schema.Attribute.String;
    slug: Schema.Attribute.UID<'full_name'>;
    specialisation: Schema.Attribute.Relation<
      'manyToMany',
      'api::expertise.expertise'
    >;
    unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiProgrammeProgramme extends Struct.CollectionTypeSchema {
  collectionName: 'programmes';
  info: {
    displayName: 'Academics \u2013 Programmes';
    pluralName: 'programmes';
    singularName: 'programme';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    about: Schema.Attribute.Text;
    admission_requirements: Schema.Attribute.Text;
    annual_fee: Schema.Attribute.Decimal;
    career_opportunities: Schema.Attribute.Text;
    coordinator: Schema.Attribute.Relation<'manyToOne', 'api::person.person'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    curriculum: Schema.Attribute.Component<'programme.curriculum-block', true>;
    degree_type: Schema.Attribute.String;
    department: Schema.Attribute.Relation<
      'manyToOne',
      'api::department.department'
    >;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    duration: Schema.Attribute.String;
    expires_at: Schema.Attribute.DateTime;
    faqs: Schema.Attribute.Component<'shared.faq-item', true>;
    featured_for_international: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    further_study: Schema.Attribute.Text;
    hero_image: Schema.Attribute.Media<'images'>;
    intake_status: Schema.Attribute.Enumeration<['open', 'closed', 'waitlist']>;
    last_reviewed: Schema.Attribute.Date;
    learning_outcomes: Schema.Attribute.Text;
    level: Schema.Attribute.Enumeration<['undergraduate', 'postgraduate']> &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::programme.programme'
    > &
      Schema.Attribute.Private;
    objectives: Schema.Attribute.Text;
    overview: Schema.Attribute.Text;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'>;
    programme_name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    seo_description: Schema.Attribute.Text;
    seo_title: Schema.Attribute.String;
    short_description: Schema.Attribute.Text;
    slug: Schema.Attribute.UID<'programme_name'>;
    unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRecruitmentRecruitment extends Struct.CollectionTypeSchema {
  collectionName: 'recruitments';
  info: {
    description: 'Replaced by News & Notices \u2013 Recruitment (Vacancies). Hidden from the admin; kept only so its table is not dropped.';
    displayName: 'News & Notices \u2013 Recruitment (old, not used)';
    pluralName: 'recruitments';
    singularName: 'recruitment';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    apply_url: Schema.Attribute.String;
    archive_after: Schema.Attribute.Date;
    closing_date: Schema.Attribute.Date;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    employment_type: Schema.Attribute.Enumeration<
      ['regular', 'fixed_term', 'contract']
    >;
    expires_at: Schema.Attribute.DateTime & Schema.Attribute.Required;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::recruitment.recruitment'
    > &
      Schema.Attribute.Private;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    post_title: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    reference_no: Schema.Attribute.String;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    stage: Schema.Attribute.Enumeration<
      [
        'advertised',
        'shortlisted_written',
        'shortlisted_viva',
        'result_declared',
        'closed_unfilled',
      ]
    > &
      Schema.Attribute.Required;
    stage_documents: Schema.Attribute.Component<'shared.stage-document', true>;
    unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiResearchCentreResearchCentre
  extends Struct.CollectionTypeSchema {
  collectionName: 'research_centres';
  info: {
    displayName: 'Research \u2013 Centres';
    pluralName: 'research-centres';
    singularName: 'research-centre';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    acronym: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    expires_at: Schema.Attribute.DateTime;
    external_link: Schema.Attribute.String;
    focus_areas: Schema.Attribute.Relation<
      'manyToMany',
      'api::expertise.expertise'
    >;
    is_featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    lead: Schema.Attribute.Relation<'oneToOne', 'api::person.person'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::research-centre.research-centre'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images'>;
    logo_alt: Schema.Attribute.String;
    members: Schema.Attribute.Relation<'manyToMany', 'api::person.person'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    slug: Schema.Attribute.UID<'name'>;
    summary: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    themes: Schema.Attribute.Text;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiResearchOverviewResearchOverview
  extends Struct.SingleTypeSchema {
  collectionName: 'research_overview';
  info: {
    description: 'The Research landing page (/research), top to bottom. Centres and projects are edited in Research \u2013 Centres and Research \u2013 Projects.';
    displayName: 'Research \u2013 Overview';
    pluralName: 'research-overviews';
    singularName: 'research-overview';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.landing-card', true>;
    centres_heading: Schema.Attribute.String;
    centres_intro: Schema.Attribute.Text;
    collaboration_heading: Schema.Attribute.String;
    collaboration_office: Schema.Attribute.Relation<
      'oneToOne',
      'api::contact-person.contact-person'
    >;
    collaboration_text: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    expertise_heading: Schema.Attribute.String;
    expertise_link: Schema.Attribute.Component<'shared.link-item', false>;
    expertise_text: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    facilities: Schema.Attribute.Component<'research.facility', true>;
    facilities_heading: Schema.Attribute.String;
    facilities_intro: Schema.Attribute.Text;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    grants: Schema.Attribute.Component<'research.grant', true>;
    grants_heading: Schema.Attribute.String;
    grants_intro: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    hero_buttons: Schema.Attribute.Component<'shared.link-item', true>;
    hero_image: Schema.Attribute.Media<'images'>;
    hero_image_alt: Schema.Attribute.String;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    journal: Schema.Attribute.Component<'research.journal', false>;
    journal_heading: Schema.Attribute.String;
    journal_intro: Schema.Attribute.Text;
    labels: Schema.Attribute.Component<'research.labels', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::research-overview.research-overview'
    > &
      Schema.Attribute.Private;
    news_heading: Schema.Attribute.String;
    news_intro: Schema.Attribute.Text;
    news_limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    news_stories: Schema.Attribute.Relation<'oneToMany', 'api::news.news'>;
    policies: Schema.Attribute.Component<'research.resource', true>;
    policies_heading: Schema.Attribute.String;
    policies_intro: Schema.Attribute.Text;
    projects_heading: Schema.Attribute.String;
    projects_intro: Schema.Attribute.Text;
    projects_limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 24;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.DynamicZone<
      ['sections.rich-text', 'sections.image-text', 'sections.call-to-action']
    >;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiResearchProjectResearchProject
  extends Struct.CollectionTypeSchema {
  collectionName: 'research_projects';
  info: {
    description: 'Research projects, as listed on the official Research Centres and Projects page.';
    displayName: 'Research \u2013 Projects';
    pluralName: 'research-projects';
    singularName: 'research-project';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    budget: Schema.Attribute.String;
    centre: Schema.Attribute.Relation<
      'manyToOne',
      'api::research-centre.research-centre'
    >;
    centre_label: Schema.Attribute.String;
    co_investigators: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    end_date: Schema.Attribute.Date;
    funding_source: Schema.Attribute.String;
    funding_type: Schema.Attribute.Enumeration<
      ['college_grant', 'national', 'international']
    > &
      Schema.Attribute.DefaultTo<'college_grant'>;
    is_featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    link_label: Schema.Attribute.String;
    link_url: Schema.Attribute.String;
    listed_status: Schema.Attribute.Enumeration<
      ['ongoing', 'completed', 'not_stated']
    > &
      Schema.Attribute.DefaultTo<'not_stated'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::research-project.research-project'
    > &
      Schema.Attribute.Private;
    period_label: Schema.Attribute.String;
    principal_investigator: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    source_note: Schema.Attribute.String;
    start_date: Schema.Attribute.Date;
    summary: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiResearchPublicationResearchPublication
  extends Struct.CollectionTypeSchema {
  collectionName: 'research_publications';
  info: {
    displayName: 'Research \u2013 Publications';
    pluralName: 'research-publications';
    singularName: 'research-publication';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    authors: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    doi: Schema.Attribute.String;
    external_link: Schema.Attribute.String;
    faculty: Schema.Attribute.Relation<
      'manyToOne',
      'api::faculty-profile.faculty-profile'
    >;
    journal: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::research-publication.research-publication'
    > &
      Schema.Attribute.Private;
    pdf: Schema.Attribute.Media<'files'>;
    publication_year: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSiteSettingsSiteSettings extends Struct.SingleTypeSchema {
  collectionName: 'site_settings';
  info: {
    displayName: 'Global \u2013 Site Settings';
    pluralName: 'site-settings-collection';
    singularName: 'site-settings';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    default_meta_description: Schema.Attribute.Text;
    default_og_image: Schema.Attribute.Media<'images'>;
    footer_link_groups: Schema.Attribute.Component<'shared.link-group', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::site-settings.site-settings'
    > &
      Schema.Attribute.Private;
    official_emails: Schema.Attribute.JSON;
    phones: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    site_name: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Sherubtse College'>;
    site_tagline: Schema.Attribute.String;
    social_links: Schema.Attribute.Component<'shared.social-link', true>;
    subdomain_links: Schema.Attribute.Component<'shared.link-item', true>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiStudentLifeOverviewStudentLifeOverview
  extends Struct.SingleTypeSchema {
  collectionName: 'student_life_overview';
  info: {
    displayName: 'Student Life \u2013 Overview';
    pluralName: 'student-life-overviews';
    singularName: 'student-life-overview';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.landing-card', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eyebrow: Schema.Attribute.String;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::student-life-overview.student-life-overview'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sections: Schema.Attribute.DynamicZone<
      ['sections.rich-text', 'sections.image-text', 'sections.call-to-action']
    >;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUnitCategoryUnitCategory
  extends Struct.CollectionTypeSchema {
  collectionName: 'unit_categories';
  info: {
    description: 'Groups for the Administrative Units directory. Only categories with published units are shown.';
    displayName: 'About \u2013 Administrative Units: Categories';
    pluralName: 'unit-categories';
    singularName: 'unit-category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::unit-category.unit-category'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUnitUnit extends Struct.CollectionTypeSchema {
  collectionName: 'units';
  info: {
    description: 'Departments, administrative offices, research centres and student bodies. Administrative ones appear on About \u2192 Administrative Units.';
    displayName: 'About \u2013 Administrative Units';
    pluralName: 'units';
    singularName: 'unit';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.Relation<
      'manyToOne',
      'api::unit-category.unit-category'
    >;
    contact: Schema.Attribute.Component<'shared.contact-block', false>;
    content_owner: Schema.Attribute.Relation<'oneToOne', 'api::person.person'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    display_order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    documents: Schema.Attribute.Component<'shared.attachment', true>;
    head: Schema.Attribute.Relation<'oneToOne', 'api::person.person'>;
    head_designation: Schema.Attribute.String;
    head_name: Schema.Attribute.String;
    head_portrait: Schema.Attribute.Media<'images'>;
    head_portrait_alt: Schema.Attribute.String;
    is_featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    kind: Schema.Attribute.Enumeration<
      ['academic', 'administrative', 'research_centre', 'student_body']
    > &
      Schema.Attribute.Required;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    links: Schema.Attribute.Component<'shared.link-item', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::unit.unit'> &
      Schema.Attribute.Private;
    location: Schema.Attribute.String;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    office: Schema.Attribute.Relation<
      'manyToOne',
      'api::contact-person.contact-person'
    >;
    photo: Schema.Attribute.Media<'images'>;
    publishedAt: Schema.Attribute.DateTime;
    responsibilities: Schema.Attribute.Component<'units.point', true>;
    services: Schema.Attribute.Component<'units.point', true>;
    short_name: Schema.Attribute.String;
    slug: Schema.Attribute.UID<'name'>;
    summary: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiUnitsPageUnitsPage extends Struct.SingleTypeSchema {
  collectionName: 'units_page';
  info: {
    description: 'Hero, section headings and messages for the Administrative Units page.';
    displayName: 'About \u2013 Administrative Units: Page Settings';
    pluralName: 'units-pages';
    singularName: 'units-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    directory_heading: Schema.Attribute.String;
    directory_intro: Schema.Attribute.Text;
    empty_message: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    featured_heading: Schema.Attribute.String;
    featured_intro: Schema.Attribute.Text;
    hero_image: Schema.Attribute.Media<'images'>;
    hero_image_alt: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::units-page.units-page'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiVacancyAnnouncementVacancyAnnouncement
  extends Struct.CollectionTypeSchema {
  collectionName: 'vacancy_announcements';
  info: {
    description: 'Staff vacancies and their selection stages \u2014 shown on the Recruitment page.';
    displayName: 'News & Notices \u2013 Recruitment (Vacancies)';
    pluralName: 'vacancy-announcements';
    singularName: 'vacancy-announcement';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    additional_notes: Schema.Attribute.RichText;
    application_deadline: Schema.Attribute.Date;
    attachment: Schema.Attribute.Media<'files'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date_posted: Schema.Attribute.Date & Schema.Attribute.Required;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    final_selected: Schema.Attribute.Component<
      'announcements.shortlist-row',
      true
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::vacancy-announcement.vacancy-announcement'
    > &
      Schema.Attribute.Private;
    position_name: Schema.Attribute.String;
    position_openings: Schema.Attribute.Component<
      'announcements.position-opening',
      true
    >;
    posting_status: Schema.Attribute.Enumeration<['open', 'closed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'open'>;
    publishedAt: Schema.Attribute.DateTime;
    result_date: Schema.Attribute.Date;
    slug: Schema.Attribute.UID<'title'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      [
        'vacancy_announcement',
        're_vacancy_announcement',
        'shortlisted_written',
        'shortlisted_viva',
        'selection_result',
      ]
    > &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    viva_date: Schema.Attribute.Date;
    viva_shortlist: Schema.Attribute.Component<
      'announcements.shortlist-row',
      true
    >;
    viva_time: Schema.Attribute.String;
    viva_venue: Schema.Attribute.String;
    written_exam_date: Schema.Attribute.Date;
    written_exam_shortlist: Schema.Attribute.Component<
      'announcements.written-exam-candidate',
      true
    >;
    written_exam_time: Schema.Attribute.String;
    written_exam_venue: Schema.Attribute.String;
  };
}

export interface ApiVisionMissionPageVisionMissionPage
  extends Struct.SingleTypeSchema {
  collectionName: 'vision_mission_page';
  info: {
    description: 'The official vision, mission statements and core values. Keep the official wording exactly as approved.';
    displayName: 'About \u2013 Vision, Mission & Core Values';
    pluralName: 'vision-mission-pages';
    singularName: 'vision-mission-page';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    closing_note: Schema.Attribute.Text;
    core_values: Schema.Attribute.Component<'about.core-value', true>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    hero_eyebrow: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'WHO WE ARE'>;
    hero_heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Vision, Mission & Core Values'>;
    hero_image: Schema.Attribute.Media<'images'>;
    hero_intro: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::vision-mission-page.vision-mission-page'
    > &
      Schema.Attribute.Private;
    missions: Schema.Attribute.Component<'about.mission-item', true>;
    publishedAt: Schema.Attribute.DateTime;
    seo_description: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    vision_highlights: Schema.Attribute.Text;
    vision_statement: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.Text;
    caption: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    focalPoint: Schema.Attribute.JSON;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.Text;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.Text & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::about-overview.about-overview': ApiAboutOverviewAboutOverview;
      'api::about-page.about-page': ApiAboutPageAboutPage;
      'api::academic-guide.academic-guide': ApiAcademicGuideAcademicGuide;
      'api::academics-overview.academics-overview': ApiAcademicsOverviewAcademicsOverview;
      'api::admission-bhutanese.admission-bhutanese': ApiAdmissionBhutaneseAdmissionBhutanese;
      'api::admission-enquiry-setting.admission-enquiry-setting': ApiAdmissionEnquirySettingAdmissionEnquirySetting;
      'api::admission-enquiry.admission-enquiry': ApiAdmissionEnquiryAdmissionEnquiry;
      'api::admission-international-applicants.admission-international-applicants': ApiAdmissionInternationalApplicantsAdmissionInternationalApplicants;
      'api::admissions-overview.admissions-overview': ApiAdmissionsOverviewAdmissionsOverview;
      'api::alumni-achievement.alumni-achievement': ApiAlumniAchievementAlumniAchievement;
      'api::alumni-chapter.alumni-chapter': ApiAlumniChapterAlumniChapter;
      'api::alumni-gallery-image.alumni-gallery-image': ApiAlumniGalleryImageAlumniGalleryImage;
      'api::alumni-registration.alumni-registration': ApiAlumniRegistrationAlumniRegistration;
      'api::alumni-setting.alumni-setting': ApiAlumniSettingAlumniSetting;
      'api::alumni.alumni': ApiAlumniAlumni;
      'api::announcement.announcement': ApiAnnouncementAnnouncement;
      'api::award.award': ApiAwardAward;
      'api::calendar-entry.calendar-entry': ApiCalendarEntryCalendarEntry;
      'api::club.club': ApiClubClub;
      'api::contact-enquiry.contact-enquiry': ApiContactEnquiryContactEnquiry;
      'api::contact-page-content.contact-page-content': ApiContactPageContentContactPageContent;
      'api::contact-person.contact-person': ApiContactPersonContactPerson;
      'api::department.department': ApiDepartmentDepartment;
      'api::document.document': ApiDocumentDocument;
      'api::event.event': ApiEventEvent;
      'api::expertise.expertise': ApiExpertiseExpertise;
      'api::facilities-page.facilities-page': ApiFacilitiesPageFacilitiesPage;
      'api::facility-category.facility-category': ApiFacilityCategoryFacilityCategory;
      'api::facility-gallery-image.facility-gallery-image': ApiFacilityGalleryImageFacilityGalleryImage;
      'api::facility-quick-link.facility-quick-link': ApiFacilityQuickLinkFacilityQuickLink;
      'api::facility.facility': ApiFacilityFacility;
      'api::faculty-profile.faculty-profile': ApiFacultyProfileFacultyProfile;
      'api::faculty-setting.faculty-setting': ApiFacultySettingFacultySetting;
      'api::feature.feature': ApiFeatureFeature;
      'api::footer.footer': ApiFooterFooter;
      'api::history-content.history-content': ApiHistoryContentHistoryContent;
      'api::history-gallery-image.history-gallery-image': ApiHistoryGalleryImageHistoryGalleryImage;
      'api::history-legacy-item.history-legacy-item': ApiHistoryLegacyItemHistoryLegacyItem;
      'api::history-timeline-item.history-timeline-item': ApiHistoryTimelineItemHistoryTimelineItem;
      'api::history-tradition-item.history-tradition-item': ApiHistoryTraditionItemHistoryTraditionItem;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::leadership-member.leadership-member': ApiLeadershipMemberLeadershipMember;
      'api::navigation.navigation': ApiNavigationNavigation;
      'api::news-notices-overview.news-notices-overview': ApiNewsNoticesOverviewNewsNoticesOverview;
      'api::news.news': ApiNewsNews;
      'api::newsletter-subscriber.newsletter-subscriber': ApiNewsletterSubscriberNewsletterSubscriber;
      'api::newsletter-topic.newsletter-topic': ApiNewsletterTopicNewsletterTopic;
      'api::newsletter.newsletter': ApiNewsletterNewsletter;
      'api::notice.notice': ApiNoticeNotice;
      'api::page.page': ApiPagePage;
      'api::person.person': ApiPersonPerson;
      'api::programme.programme': ApiProgrammeProgramme;
      'api::recruitment.recruitment': ApiRecruitmentRecruitment;
      'api::research-centre.research-centre': ApiResearchCentreResearchCentre;
      'api::research-overview.research-overview': ApiResearchOverviewResearchOverview;
      'api::research-project.research-project': ApiResearchProjectResearchProject;
      'api::research-publication.research-publication': ApiResearchPublicationResearchPublication;
      'api::site-settings.site-settings': ApiSiteSettingsSiteSettings;
      'api::student-life-overview.student-life-overview': ApiStudentLifeOverviewStudentLifeOverview;
      'api::unit-category.unit-category': ApiUnitCategoryUnitCategory;
      'api::unit.unit': ApiUnitUnit;
      'api::units-page.units-page': ApiUnitsPageUnitsPage;
      'api::vacancy-announcement.vacancy-announcement': ApiVacancyAnnouncementVacancyAnnouncement;
      'api::vision-mission-page.vision-mission-page': ApiVisionMissionPageVisionMissionPage;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
