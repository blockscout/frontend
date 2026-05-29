// SPDX-License-Identifier: LicenseRef-Blockscout

import * as essentialDappsChainsConfig from 'client/features/marketplace/chains-config/essential-dapps/config.nodejs';
import * as multichainConfig from 'client/features/multichain/chains-config/config.nodejs';

import config from 'client/config';

const marketplaceFeature = config.features.marketplace;

(async() => {
  config.features.multichain.isEnabled && await multichainConfig.load();
  marketplaceFeature.isEnabled && marketplaceFeature.essentialDapps && await essentialDappsChainsConfig.load();
})();
