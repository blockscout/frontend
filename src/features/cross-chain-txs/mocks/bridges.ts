import type { Bridge } from '@blockscout/interchain-indexer-types';

export const bridgeAmb = {
  id: 1,
  name: 'AMB/Omnibridge',
  type: 'amb',
  enabled: true,
  ui_url: 'https://bridge.gnosischain.com/bridge-explorer/transaction/{{message_id}}',
  docs_url: 'https://docs.gnosischain.com/bridges/About%20Token%20Bridges/amb-bridge',
  indexed_chain_ids: [ '1', '100' ],
} satisfies Bridge;

export const bridgeAvalanche = {
  id: 2,
  name: 'Avalanche ICTT',
  type: 'avalanche_native',
  enabled: true,
  ui_url: undefined,
  docs_url: undefined,
  indexed_chain_ids: [ '8021', '43114' ],
} satisfies Bridge;

export const bridgeXdai = {
  id: 3,
  name: 'xDai Bridge',
  type: 'xdai',
  enabled: true,
  ui_url: 'https://bridge.gnosischain.com/bridge-explorer/transaction/{{message_id}}',
  docs_url: 'https://docs.gnosischain.com/bridges/About%20Token%20Bridges/xdai-bridge',
  indexed_chain_ids: [ '1', '100' ],
} satisfies Bridge;
