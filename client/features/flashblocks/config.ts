// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

import megaEthFeature from 'client/features/chain-variants/mega-eth/config';

const title = 'Flashblocks';

const socketUrl = getEnvValue('NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL');

const config: Feature<{ socketUrl: string; type: 'optimism' | 'megaEth'; name: string }> = (() => {
  if (megaEthFeature.isEnabled && megaEthFeature.socketUrl.rpc) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl: megaEthFeature.socketUrl.rpc,
      type: 'megaEth',
      name: 'mini-block',
    });
  }

  if (socketUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl,
      type: 'optimism',
      name: 'flashblock',
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
