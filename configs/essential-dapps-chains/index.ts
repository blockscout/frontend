import type { MultichainConfig } from 'types/multichain';

import config from 'configs/app';
import { isBrowser } from 'toolkit/utils/isBrowser';

const marketplaceFeature = config.features.marketplace;

const essentialDappsChains: () => MultichainConfig | undefined = () => {
  if (!marketplaceFeature.isEnabled || !marketplaceFeature.essentialDapps) {
    return;
  }

  if (isBrowser()) {
    return window.__essentialDappsChains;
  }
};

export default essentialDappsChains;
