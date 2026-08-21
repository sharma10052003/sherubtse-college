import { requireAltText } from '../../../../utils/require-alt-text';

export default {
  async beforeCreate(event: any) {
    await requireAltText(event.params.data, ['hero_images']);
  },
  async beforeUpdate(event: any) {
    await requireAltText(event.params.data, ['hero_images']);
  },
};
