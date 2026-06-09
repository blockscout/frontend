// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MultichainConfig } from 'src/features/multichain/types/client';

import config from 'src/config';

import { isBrowser } from 'src/toolkit/utils/isBrowser';

import * as multichainConfigNodejs from './config.nodejs';

const multichainConfig: () => MultichainConfig | undefined = () => {
  if (!config.features.multichain.isEnabled) {
    return;
  }

  if (isBrowser()) {
    return window.__multichainConfig;
  }

  return multichainConfigNodejs.getValue();
};

export default multichainConfig;
