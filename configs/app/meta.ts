import app from './app';
import { getEnvValue, getExternalAssetFilePath } from './utils';

const defaultImageUrl = app.baseUrl + '/static/placeholder.png';

const meta = Object.freeze({
  promoteBlockscoutInTitle:
    getEnvValue('NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE') || 'false',
  og: {
    description:
      getEnvValue('NEXT_PUBLIC_OG_DESCRIPTION') ||
      // eslint-disable-next-line max-len
      'Rbascan allows you to explore and search the Roburna blockchain for transactions, addresses, tokens, prices and other activities taking place on Roburna (RBA)',
    imageUrl:
      getExternalAssetFilePath('NEXT_PUBLIC_OG_IMAGE_URL') || defaultImageUrl,
  },
});

export default meta;
