// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const title = 'MegaETH chain';

const socketUrlMetrics = getEnvValue('NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_METRICS');
const socketUrlRpc = getEnvValue('NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_RPC');

const config: Feature<{ socketUrl: { metrics?: string; rpc?: string } }> = (() => {

  if (socketUrlMetrics || socketUrlRpc) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl: {
        metrics: socketUrlMetrics,
        rpc: socketUrlRpc,
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
