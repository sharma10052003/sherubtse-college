import type { Schema, Struct } from '@strapi/strapi';

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

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'programme.curriculum-block': ProgrammeCurriculumBlock;
      'shared.button': SharedButton;
      'shared.faq-item': SharedFaqItem;
    }
  }
}
