import app from './app';
import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from './utils';

const defaultImageUrl = app.baseUrl + '/static/og_placeholder.png';

const protocol = getEnvValue('NEXT_PUBLIC_APP_PROTOCOL');
const host = getEnvValue('NEXT_PUBLIC_APP_HOST');
const port = getEnvValue('NEXT_PUBLIC_APP_PORT');
const path = getExternalAssetFilePath('NEXT_PUBLIC_OG_IMAGE_URL');
const ogImageUrl = new URL(path || '', `${ protocol }://${ host }:${ port }`);

const meta = Object.freeze({
  promoteBlockscoutInTitle: parseEnvJson<boolean>(getEnvValue('NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE')) ?? true,
  og: {
    title: getEnvValue('NEXT_PUBLIC_OG_TITLE') || '',
    description: getEnvValue('NEXT_PUBLIC_OG_DESCRIPTION') || '',
    imageUrl: path ? ogImageUrl.href : defaultImageUrl,
  },
});

export default meta;
