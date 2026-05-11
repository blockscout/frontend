/* eslint-disable max-len */
import type { RpcTransactionReceipt } from 'viem';

import type { AddressParam } from 'client/slices/address/types/api';
import type { Transaction } from 'client/slices/tx/types/api';

import * as addressMock from 'client/slices/address/mocks/address';
import * as decodedInputDataMock from 'client/slices/log/mocks/decoded-input';
import * as tokenTransferMock from 'client/slices/token-transfer/mocks';

import { publicTag, privateTag, watchlistName } from 'client/features/account/mocks/address-tags';

import { protocolTag } from 'mocks/metadata/address';

export const base: Transaction = {
  base_fee_per_gas: '10000000000',
  block_number: 29611750,
  confirmation_duration: [
    0,
    6364,
  ],
  confirmations: 508299,
  created_contract: null,
  decoded_input: decodedInputDataMock.withoutIndexedFields,
  exchange_rate: '0.00254428',
  historic_exchange_rate: '0.00254428',
  fee: {
    type: 'actual',
    value: '7143168000000000',
  },
  from: {
    hash: '0x047A81aFB05D9B1f8844bf60fcA05DCCFbC584B9',
    implementations: null,
    is_contract: false,
    name: null,
    is_verified: null,
    private_tags: [ ],
    public_tags: [ publicTag ],
    watchlist_names: [],
    ens_domain_name: 'kitty.kitty.cat.eth',
  },
  gas_limit: '800000',
  gas_price: '48000000000',
  gas_used: '148816',
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
  max_fee_per_gas: '40190625000',
  max_priority_fee_per_gas: '28190625000',
  method: 'updateSmartAsset',
  nonce: 27831,
  position: 7,
  priority_fee: '1299672384375000',
  raw_input: '0xfa4b78b90000000000000000000000000000000000000000000000000000000005001bcfe835d1028984e9e6e7d016b77164eacbcc6cc061e9333c0b37982b504f7ea791000000000000000000000000a79b29ad7e0196c95b87f4663ded82fbf2e3add8',
  result: 'success',
  revert_reason: null,
  status: 'ok',
  timestamp: '2022-10-10T14:34:30.000000Z',
  to: {
    hash: addressMock.hash,
    implementations: null,
    is_contract: false,
    is_verified: true,
    name: null,
    private_tags: [ privateTag ],
    public_tags: [],
    watchlist_names: [ watchlistName ],
    ens_domain_name: null,
  },
  token_transfers: [],
  token_transfers_overflow: false,
  transaction_burnt_fee: '461030000000000',
  transaction_tag: null,
  transaction_types: [
    'contract_call',
  ],
  type: 2,
  value: '42000000000000000000',
  actions: [],
  has_error_in_internal_transactions: false,
};

export const withWatchListNames: Transaction = {
  ...base,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3194',
  from: {
    ...base.from,
    watchlist_names: [
      { label: 'from #1', display_name: 'from utka' },
      { label: 'kitty', display_name: 'kitty kitty kitty cat where are you' },
    ],
  },
  to: {
    ...base.to,
    watchlist_names: [ { label: 'to #1', display_name: 'to utka' } ],
  } as Transaction['to'],
};

export const withProtocolTag: Transaction = {
  ...base,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3194',
  to: {
    ...(base.to as AddressParam),
    metadata: {
      tags: [ protocolTag ],
      reputation: null,
    },
    private_tags: [],
    watchlist_names: [],
    public_tags: [],
  },
};

export const withPendingUpdate: Transaction = {
  ...withProtocolTag,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3133',
  is_pending_update: true,
};

export const withContractCreation: Transaction = {
  ...base,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3195',
  to: null,
  created_contract: {
    hash: '0xdda21946FF3FAa027104b15BE6970CA756439F5a',
    implementations: null,
    is_contract: true,
    is_verified: null,
    name: 'Shavuha token',
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
    ens_domain_name: null,
  },
  transaction_types: [
    'contract_creation',
  ],
};

export const withTokenTransfer: Transaction = {
  ...base,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3196',
  to: {
    hash: addressMock.hash,
    implementations: null,
    is_contract: true,
    is_verified: true,
    name: 'ArianeeStore',
    private_tags: [ privateTag ],
    public_tags: [],
    watchlist_names: [ watchlistName ],
    ens_domain_name: null,
  },
  token_transfers: [
    tokenTransferMock.erc20,
    tokenTransferMock.erc721,
    tokenTransferMock.erc1155A,
    tokenTransferMock.erc1155B,
    tokenTransferMock.erc1155C,
    tokenTransferMock.erc1155D,
    tokenTransferMock.erc404A,
    tokenTransferMock.erc404B,
  ],
  token_transfers_overflow: true,
  transaction_types: [
    'token_transfer',
  ],
};

export const withDecodedRevertReason: Transaction = {
  ...base,
  status: 'error',
  result: 'Reverted',
  revert_reason: {
    method_call: 'SomeCustomError(address addr, uint256 balance)',
    method_id: '50289a9f',
    parameters: [
      {
        name: 'addr',
        type: 'address',
        value: '0xf26594f585de4eb0ae9de865d9053fee02ac6ef1',
      },
      {
        name: 'balance',
        type: 'uint256',
        value: '123',
      },
    ],
  },
};

export const withRawRevertReason: Transaction = {
  ...base,
  status: 'error',
  result: 'Reverted',
  revert_reason: {
    raw: '4f6e6c79206368616972706572736f6e2063616e206769766520726967687420746f20766f74652e',
  },
  to: {
    hash: addressMock.hash,
    implementations: null,
    is_verified: true,
    is_contract: true,
    name: 'Bad guy',
    private_tags: [ ],
    public_tags: [],
    watchlist_names: [ ],
    ens_domain_name: null,
  },
};

export const pending: Transaction = {
  ...base,
  base_fee_per_gas: null,
  block_number: null,
  confirmation_duration: [],
  confirmations: 0,
  decoded_input: null,
  gas_used: null,
  max_fee_per_gas: null,
  max_priority_fee_per_gas: null,
  method: null,
  position: null,
  priority_fee: null,
  result: 'pending',
  revert_reason: null,
  status: null,
  timestamp: null,
  transaction_burnt_fee: null,
  transaction_tag: null,
  type: null,
  value: '0',
};

export const base2 = {
  ...base,
  hash: '0x02d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
  from: {
    ...base.from,
    hash: addressMock.hash,
  },
};

export const base3 = {
  ...base,
  hash: '0x12d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
  from: {
    ...base.from,
    hash: addressMock.hash,
  },
};

export const base4 = {
  ...base,
  hash: '0x22d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
};

export const withRecipientName = {
  ...base,
  to: addressMock.withName,
};

export const withRecipientEns = {
  ...base,
  to: addressMock.withEns,
};

export const withRecipientNameTag = {
  ...withRecipientEns,
  to: addressMock.withNameTag,
};

export const withRecipientContract = {
  ...withRecipientEns,
  to: addressMock.contract,
};

export const rpcTxReceipt: RpcTransactionReceipt = {
  blockHash: '0xa737203aac9f38b5355c716f46b84ff1031335d1a99b2366900378c9e4c837a5',
  blockNumber: '0x171f82b',
  contractAddress: null,
  cumulativeGasUsed: '0xe235b',
  effectiveGasPrice: '0x793b22f4',
  from: '0x21dc71ddd3558cd7536bb5fa422303fb5559ea63',
  gasUsed: '0x215d2',
  logs: [],
  logsBloom: '0x00400040000000000000000000000000000000000000000010000000000000000000000020000000001000000000010400000000000000000000000000000000000400000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010100000000000002801000000000000000000000000000000000000000000000000100000000004000000000000000080100000000000000000000000000000000000000000000802000000000000000000000000000000400000000000000000000000000000000000000000000000000000000004000000800000000000004000000000',
  status: 'success' as RpcTransactionReceipt['status'],
  to: '0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e',
  transactionHash: '0xc39cf2777f03346deba8659b3ff652bbcf3dcbd4fcf846a248a171e45cac94b2',
  transactionIndex: '0x2',
  type: '0x2',
};
