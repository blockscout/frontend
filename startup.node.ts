// SPDX-License-Identifier: LicenseRef-Blockscout

import * as essentialDappsChainsConfig from 'src/features/marketplace/chains-config/essential-dapps/config.nodejs';

import config from 'src/config';
import * as clusterConfig from 'src/shared/external-chains/cluster-config.nodejs';

const marketplaceFeature = config.features.marketplace;

(async() => {
  config.features.multichain.isEnabled && await clusterConfig.load();
  marketplaceFeature.isEnabled && marketplaceFeature.essentialDapps && await essentialDappsChainsConfig.load();
})();
