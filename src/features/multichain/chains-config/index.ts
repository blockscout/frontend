// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MultichainConfig } from 'src/features/multichain/types/client';

import config from 'src/config';
import { clusterConfig } from 'src/shared/external-chains/cluster-config';

const multichainConfig: () => MultichainConfig | undefined = () => {
  if (!config.features.multichain.isEnabled) {
    return;
  }

  return clusterConfig();
};

export default multichainConfig;
