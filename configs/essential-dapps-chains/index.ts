import type { EssentialDappsChainConfig } from 'types/client/marketplace';

import config from 'configs/app';
import { isBrowser } from 'toolkit/utils/isBrowser';

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
