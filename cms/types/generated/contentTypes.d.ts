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

export interface ApiAdmissionsOverviewAdmissionsOverview
  extends Struct.SingleTypeSchema {
  collectionName: 'admissions_overview';
  info: {
    displayName: 'Admissions \u2013 Overview';
    pluralName: 'admissions-overviews';
    singularName: 'admissions-overview';
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
      'api::admissions-overview.admissions-overview'
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
    email: Schema.Attribute.String & Schema.Attribute.Required;
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
    countries_represented: Schema.Attribute.Integer;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    hero_background: Schema.Attribute.Media<'images' | 'videos'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::alumni-setting.alumni-setting'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    show_achievements: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    show_chapters: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_events: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_gallery: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    show_newsletter: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    show_statistics: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    total_alumni_override: Schema.Attribute.Integer;
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
    email: Schema.Attribute.String;
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
    department: Schema.Attribute.String;
    email: Schema.Attribute.String & Schema.Attribute.Required;
    full_name: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-enquiry.contact-enquiry'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text & Schema.Attribute.Required;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    reviewed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    subject: Schema.Attribute.String & Schema.Attribute.Required;
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
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    general_email: Schema.Attribute.Email;
    general_phone: Schema.Attribute.String;
    hero_eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Get in Touch'>;
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
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-page-content.contact-page-content'
    >;
    map_url: Schema.Attribute.String;
    office_hours: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
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
    group_icon: Schema.Attribute.String;
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
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    ends_at: Schema.Attribute.DateTime;
    expires_at: Schema.Attribute.DateTime & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::event.event'> &
      Schema.Attribute.Private;
    open_to: Schema.Attribute.Enumeration<
      ['public', 'students', 'staff', 'invited']
    >;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    registration_link: Schema.Attribute.String;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    starts_at: Schema.Attribute.DateTime & Schema.Attribute.Required;
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
    map_image: Schema.Attribute.Media<'images'>;
    map_label: Schema.Attribute.String;
    map_url: Schema.Attribute.String;
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
    featured_selections: Schema.Attribute.Component<'shared.link-item', true>;
    hero_badge: Schema.Attribute.String;
    hero_buttons: Schema.Attribute.Component<'shared.link-item', true>;
    hero_eyebrow: Schema.Attribute.String;
    hero_heading: Schema.Attribute.String;
    hero_images: Schema.Attribute.Media<'images', true>;
    hero_video: Schema.Attribute.Media<'videos'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::homepage.homepage'
    > &
      Schema.Attribute.Private;
    president_message: Schema.Attribute.RichText;
    president_name: Schema.Attribute.String;
    president_photo: Schema.Attribute.Media<'images'>;
    president_title: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    quick_links: Schema.Attribute.Component<'shared.link-item', true>;
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
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    expires_at: Schema.Attribute.DateTime;
    images: Schema.Attribute.Media<'images', true>;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::news.news'> &
      Schema.Attribute.Private;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    tags: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
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
    email: Schema.Attribute.String &
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
    displayName: 'News & Notices \u2013 Notices';
    pluralName: 'notices';
    singularName: 'notice';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
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
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::notice.notice'
    > &
      Schema.Attribute.Private;
    owning_unit: Schema.Attribute.Relation<'manyToOne', 'api::unit.unit'> &
      Schema.Attribute.Required;
    publish_at: Schema.Attribute.DateTime & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    review_interval: Schema.Attribute.Enumeration<
      ['semester', 'annual', 'none']
    > &
      Schema.Attribute.DefaultTo<'none'>;
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
    displayName: 'News & Notices \u2013 Recruitment';
    pluralName: 'recruitments';
    singularName: 'recruitment';
  };
  options: {
    draftAndPublish: true;
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
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    expires_at: Schema.Attribute.DateTime;
    external_link: Schema.Attribute.String;
    focus_areas: Schema.Attribute.Relation<
      'manyToMany',
      'api::expertise.expertise'
    >;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    lead: Schema.Attribute.Relation<'oneToOne', 'api::person.person'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::research-centre.research-centre'
    > &
      Schema.Attribute.Private;
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
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiResearchOverviewResearchOverview
  extends Struct.SingleTypeSchema {
  collectionName: 'research_overview';
  info: {
    displayName: 'Research \u2013 Overview';
    pluralName: 'research-overviews';
    singularName: 'research-overview';
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
      'api::research-overview.research-overview'
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

export interface ApiUnitUnit extends Struct.CollectionTypeSchema {
  collectionName: 'units';
  info: {
    displayName: 'About \u2013 Administrative Units';
    pluralName: 'units';
    singularName: 'unit';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    contact: Schema.Attribute.Component<'shared.contact-block', false>;
    content_owner: Schema.Attribute.Relation<'oneToOne', 'api::person.person'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    head: Schema.Attribute.Relation<'oneToOne', 'api::person.person'>;
    kind: Schema.Attribute.Enumeration<
      ['academic', 'administrative', 'research_centre', 'student_body']
    > &
      Schema.Attribute.Required;
    last_reviewed: Schema.Attribute.Date & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::unit.unit'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    photo: Schema.Attribute.Media<'images'>;
    publishedAt: Schema.Attribute.DateTime;
    short_name: Schema.Attribute.String;
    slug: Schema.Attribute.UID<'name'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
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
      'api::research-publication.research-publication': ApiResearchPublicationResearchPublication;
      'api::site-settings.site-settings': ApiSiteSettingsSiteSettings;
      'api::student-life-overview.student-life-overview': ApiStudentLifeOverviewStudentLifeOverview;
      'api::unit.unit': ApiUnitUnit;
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
