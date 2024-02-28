import app from './app';
import { getEnvValue, getExternalAssetFilePath } from './utils';

const defaultImageUrl = app.baseUrl + '/static/og_placeholder.png';

const meta = Object.freeze({
  promoteBlockscoutInTitle: getEnvValue('NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE') || 'true',
  og: {
    description: getEnvValue('NEXT_PUBLIC_OG_DESCRIPTION') || '',
    imageUrl: getExternalAssetFilePath('NEXT_PUBLIC_OG_IMAGE_URL') || defaultImageUrl,
  },
});

export default meta;
