import type { GetTransfersResponse, InterchainTransfer } from '@blockscout/interchain-indexer-types';
import { MessageStatus, TokenInfo_TokenType } from '@blockscout/interchain-indexer-types';

import { config } from './config';

export const transferA = {
  bridge: {
    id: 2,
    name: 'Avalanche ICTT',
    ui_url: 'https://app.avax.network/',
  },
  message_id: '0x057b42bbbfbb4900e155a554ae67632cb21e6f5a64d815fcad7f33abe552c059',
  status: MessageStatus.MESSAGE_STATUS_COMPLETED,
  source_chain: config[0],
  destination_chain: config[1],
  source_token: {
    address_hash: '0x33a31e0f62c0ddf25090b61ef21a70d5f48725b7',
    name: 'Wrapped AVAX',
    symbol: 'WAVAX',
    decimals: '18',
    icon_url: 'https://app.avax.network/logo.svg',
    type: TokenInfo_TokenType.ERC20,
  },
  source_amount: '509700000000000000',
  source_transaction_hash: '0x866a70cb1c8c33d259c819473d7b419c0de67770755bf07dee14dd2d0c6dc8ab',
  sender: {
    hash: '0xd7e63822d0e386fb65f28f41e8c1aa8d844ba018',
    ens_domain_name: 'kitty.kitty.kitty.kitty.cat.eth',
  },
  send_timestamp: '2022-01-13T12:06:24.000Z',
  destination_token: {
    address_hash: '0x012cb6651cb29c7d5dc96173756a773f7fb87cfb',
    name: 'Wrapped AVAX',
    symbol: 'WAVAX',
    decimals: '18',
    type: TokenInfo_TokenType.ERC20,
  },
  destination_amount: '509700000000000000',
  destination_transaction_hash: '0xdbdf690cfde8af2ee855bb90bfa9977a2d8ba36c9ae1a2010c67fe3774832213',
  recipient: {
    hash: '0xd7e63822d0e386fb65f28f41e8c1aa8d844ba018',
  },
  receive_timestamp: '2022-01-13T12:06:30.000Z',
  has_unindexed_chain: false,
} satisfies InterchainTransfer;

export const transferB = {
  ...transferA,
  source_chain: {
    id: '420',
    name: 'Unknown chain',
    logo: undefined,
    explorer_url: undefined,
  },
  source_transaction_hash: '0x866a70cb1c8c33d259c819473d7b419c0de67770755bf07dee14dd2d0c6dc800',
  source_token: {
    address_hash: '0x33a31e0f62c0ddf25090b61ef21a70d5f48725b7',
    name: 'Circle USD',
    symbol: 'USDC',
    decimals: '6',
    type: TokenInfo_TokenType.ERC20,
  },
  destination_transaction_hash: '0xdbdf690cfde8af2ee855bb90bfa9977a2d8ba36c9ae1a2010c67fe3774832214',
  status: MessageStatus.MESSAGE_STATUS_FAILED,
  bridge: {
    id: 4,
    name: 'Optimism Superchain',
  },
} satisfies InterchainTransfer;

export const transferWithUnindexedDestination = {
  ...transferA,
  message_id: '0x057b42bbbfbb4900e155a554ae67632cb21e6f5a64d815fcad7f33abe552c05c',
  status: MessageStatus.MESSAGE_STATUS_INITIATED,
  destination_chain: undefined,
  destination_token: undefined,
  destination_amount: undefined,
  destination_transaction_hash: undefined,
  recipient: undefined,
  receive_timestamp: undefined,
  has_unindexed_chain: true,
} satisfies InterchainTransfer;

// xDai bridge: native xDAI leaves Gnosis and lands as ERC-20 DAI on Ethereum.
export const transferNative = {
  ...transferA,
  message_id: '0x00000064000000000000000000000000000000000000000000000000000014f4',
  bridge: {
    id: 3,
    name: 'xDai Bridge',
    ui_url: 'https://bridge.gnosischain.com/bridge-explorer/transaction/{{message_id}}',
  },
  source_transaction_hash: '0x6374f557d67ddef8b2334550fa1ccdcb13f18b3a7476375678eca6b4057a76d1',
  source_token: {
    address_hash: undefined,
    name: 'xDai',
    symbol: 'xDAI',
    decimals: '18',
    icon_url: undefined,
    type: TokenInfo_TokenType.NATIVE,
  },
  source_amount: '3112500000000000000000',
  destination_transaction_hash: '0xa30986ded02f481cb38edd0c20890e1503a11f47e66717d2985c27adcc2eb68e',
  destination_token: {
    address_hash: '0x6b175474e89094c44da98b954eedeac495271d0f',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: '18',
    icon_url: 'https://example.com/dai.png',
    type: TokenInfo_TokenType.ERC20,
  },
  destination_amount: '3112500000000000000000',
} satisfies InterchainTransfer;

export const listResponse = {
  items: [
    transferA,
    transferB,
    transferNative,
  ],
  next_page_params: {
    page_token: 'token',
  },
} satisfies GetTransfersResponse;
