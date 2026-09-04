// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlashblocksName } from 'src/features/flashblocks/types/config';
import { FLASHBLOCKS_NAMES } from 'src/features/flashblocks/types/config';

import megaEthFeature from 'src/features/chain-variants/mega-eth/config';

import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'Flashblocks';

const socketUrl = getEnvValue('NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL');
const nameFromEnv = getEnvValue('NEXT_PUBLIC_FLASHBLOCKS_NAME');
const opStackName = FLASHBLOCKS_NAMES.find((name) => name === nameFromEnv) ?? 'subblock';

// The configured name owns the blocks-page tab; the other OP Stack name stays an alias so links
// written under either name keep resolving (the `blocksTab` guard redirects it to the first id).
const opStackTabIds = [ opStackName, ...FLASHBLOCKS_NAMES.filter((name) => name !== opStackName) ].map((name) => `${ name }s`);

const config: Feature<{
  socketUrl: string;
  type: 'optimism' | 'megaEth';
  name: FlashblocksName | 'mini-block';
  tabIds: Array<string>;
}> = (() => {
  if (megaEthFeature.isEnabled && megaEthFeature.socketUrl.rpc) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl: megaEthFeature.socketUrl.rpc,
      type: 'megaEth',
      name: 'mini-block',
      tabIds: [ 'mini-blocks' ],
    });
  }

  if (socketUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl,
      type: 'optimism',
      name: opStackName,
      tabIds: opStackTabIds,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
