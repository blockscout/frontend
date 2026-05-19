// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'configs/app/utils';

const config = Object.freeze({
  isEnabled: getEnvValue('NEXT_PUBLIC_INTERNAL_TXS_ENABLED') !== 'false',
});

export default config;
