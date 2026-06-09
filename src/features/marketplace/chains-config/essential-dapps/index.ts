// SPDX-License-Identifier: LicenseRef-Blockscout

import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';

import config from 'src/config';

import { isBrowser } from 'src/toolkit/utils/isBrowser';

import * as essentialDappsChainsConfigNodejs from './config.nodejs';

const marketplaceFeature = config.features.marketplace;

const essentialDappsChains: () => { chains: Array<EssentialDappsChainConfig> } | undefined = () => {
  if (!marketplaceFeature.isEnabled || !marketplaceFeature.essentialDapps) {
    return;
  }

  if (isBrowser()) {
    return window.__essentialDappsChains;
  }

  return essentialDappsChainsConfigNodejs.getValue();
};

export default essentialDappsChains;
