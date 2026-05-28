// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'client/config/app';
import { getEnvValue, getExternalAssetFilePath } from 'client/config/utils/envs';

const defaultImageUrl = '/static/og_image.png';

const meta = Object.freeze({
  promoteBlockscoutInTitle: getEnvValue('NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE') === 'false' ? false : true,
  og: {
    description: getEnvValue('NEXT_PUBLIC_OG_DESCRIPTION') || '',
    imageUrl: app.baseUrl + (getExternalAssetFilePath('NEXT_PUBLIC_OG_IMAGE_URL') || defaultImageUrl),
    enhancedDataEnabled: getEnvValue('NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED') === 'true',
  },
  seo: {
    enhancedDataEnabled: getEnvValue('NEXT_PUBLIC_SEO_ENHANCED_DATA_ENABLED') === 'true',
  },
});

export default meta;
