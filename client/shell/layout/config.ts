// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'client/config/utils/envs';

const config = Object.freeze({
  maxContentWidth: getEnvValue('NEXT_PUBLIC_MAX_CONTENT_WIDTH_ENABLED') === 'false' ? false : true,
});

export default config;
