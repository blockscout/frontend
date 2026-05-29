// SPDX-License-Identifier: LicenseRef-Blockscout

import * as essentialDappsChainsConfig from 'src/features/marketplace/chains-config/essential-dapps/config.nodejs';
import * as multichainConfig from 'src/features/multichain/chains-config/config.nodejs';

import config from 'src/config';

const marketplaceFeature = config.features.marketplace;

(async() => {
  config.features.multichain.isEnabled && await multichainConfig.load();
  marketplaceFeature.isEnabled && marketplaceFeature.essentialDapps && await essentialDappsChainsConfig.load();
})();
