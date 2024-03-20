import app from './app';
import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from './utils';

const path = getExternalAssetFilePath('NEXT_PUBLIC_OG_IMAGE_URL');
let ogImageUrl: URL;

// Hanlde Nextjs to collect page data
try {
  ogImageUrl = new URL(path || '', app.baseUrl);
} catch (e) {
  ogImageUrl = new URL('', 'https://placehodler');
}

const meta = Object.freeze({
  promoteBlockscoutInTitle: parseEnvJson<boolean>(getEnvValue('NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE')) ?? true,
  og: {
    url: ogImageUrl,
    title: getEnvValue('NEXT_PUBLIC_OG_TITLE') || '',
    description: getEnvValue('NEXT_PUBLIC_OG_DESCRIPTION') || '',
  },
});

export default meta;
