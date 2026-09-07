// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlashblocksName, FlashblocksTabId } from 'src/features/flashblocks/types/config';
import { FLASHBLOCKS_NAMES } from 'src/features/flashblocks/types/config';

import megaEthFeature from 'src/features/chain-variants/mega-eth/config';

import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

type TabId = FlashblocksTabId | 'mini-blocks';

const title = 'Flashblocks';

const socketUrl = getEnvValue('NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL');
const nameFromEnv = getEnvValue('NEXT_PUBLIC_FLASHBLOCKS_NAME');
const opStackName = FLASHBLOCKS_NAMES.find((name) => name === nameFromEnv) ?? 'subblock';
const opStackTabIds: [ FlashblocksTabId, ...Array<FlashblocksTabId> ] = opStackName === 'subblock' ?
  [ 'subblocks', 'flashblocks' ] :
  [ 'flashblocks', 'subblocks' ];
const megaEthTabIds: [ TabId ] = [ 'mini-blocks' ];

const config: Feature<{
  socketUrl: string;
  type: 'optimism' | 'megaEth';
  name: FlashblocksName | 'mini-block';
  tabIds: [ TabId, ...Array<TabId> ];
}> = (() => {
  if (megaEthFeature.isEnabled && megaEthFeature.socketUrl.rpc) {
    return Object.freeze({
      title,
      isEnabled: true,
      socketUrl: megaEthFeature.socketUrl.rpc,
      type: 'megaEth',
      name: 'mini-block',
      tabIds: megaEthTabIds,
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
