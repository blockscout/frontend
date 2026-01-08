import type { InterchainMessage, InterchainTransfer } from '@blockscout/interchain-indexer-types';

import { ADDRESS_HASH } from './addressParams';
import { TX_HASH } from './tx';

const MESSAGE_ID = '0xde5c33c6b3424cec51ea6f5d081f64719d531eec74f2a2408141274c117c5f44';

export const INTERCHAIN_TRANSFER = {
  bridge: {
    name: 'Avalanche ICTT',
  },
  message_id: MESSAGE_ID,
  status: 'completed',
  source_token: {
    chain_id: '8021',
    address: ADDRESS_HASH,
    name: 'Wrapped AVAX',
    symbol: 'WAVAX',
    decimals: '18',
  },
  source_amount: '80800000000000000',
  source_transaction_hash: TX_HASH,
  sender: {
    hash: ADDRESS_HASH,
  },
  send_timestamp: '2026-01-07T18:41:50.000Z',
  destination_token: {
    chain_id: '43114',
    address: ADDRESS_HASH,
    name: 'Wrapped AVAX',
    symbol: 'WAVAX',
    decimals: '18',
  },
  destination_amount: '80800000000000000',
  destination_transaction_hash: TX_HASH,
  recipient: {
    hash: ADDRESS_HASH,
  },
  receive_timestamp: '2026-01-07T18:41:53.000Z',
} satisfies InterchainTransfer;

export const INTERCHAIN_MESSAGE = {
  bridge: {
    name: 'Avalanche ICTT',
  },
  message_id: MESSAGE_ID,
  status: 'completed',
  source_chain_id: '8021',
  send_timestamp: '2026-01-07T18:41:50.000Z',
  sender: {
    hash: ADDRESS_HASH,
  },
  source_transaction_hash: TX_HASH,
  destination_chain_id: '43114',
  receive_timestamp: '2026-01-07T18:41:53.000Z',
  recipient: {
    hash: ADDRESS_HASH,
  },
  destination_transaction_hash: TX_HASH,
  payload: '0x00',
  extra: {},
  transfers: [
    INTERCHAIN_TRANSFER,
  ],
} satisfies InterchainMessage;
