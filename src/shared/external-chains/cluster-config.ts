// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MultichainConfig } from 'src/features/multichain/types/client';

import { isBrowser } from 'src/toolkit/utils/isBrowser';

import * as clusterConfigNodejs from './cluster-config.nodejs';

export const CLUSTER_CONFIG_SCRIPT_URL = '/assets/multichain/config.js';

// Defined wherever the cluster config was generated, whatever features are enabled. To ask "is this the
// Multichain explorer", use `src/features/multichain/chains-config`.
export function clusterConfig(): MultichainConfig | undefined {
  if (isBrowser()) {
    return window.__multichainConfig;
  }

  return clusterConfigNodejs.getValue();
}
