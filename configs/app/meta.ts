import app from './app';
import { getEnvValue } from './utils';

const defaultImageUrl = app.baseUrl + '/static/og_placeholder.png';

const meta = Object.freeze({
  promoteBlockscout: getEnvValue(process.env.NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE) || 'true',
  og: {
    description: getEnvValue(process.env.NEXT_PUBLIC_OG_DESCRIPTION) || '',
    imageUrl: getEnvValue(process.env.NEXT_PUBLIC_OG_IMAGE_URL) || defaultImageUrl,
  },
});

export default meta;
