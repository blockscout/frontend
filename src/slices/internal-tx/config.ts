// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'src/config/utils/envs';

const config = Object.freeze({
  isEnabled: getEnvValue('NEXT_PUBLIC_INTERNAL_TXS_ENABLED') !== 'false',
});

export default config;
