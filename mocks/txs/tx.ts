/* eslint-disable max-len */
import type { Transaction } from 'types/api/transaction';

import { publicTag, privateTag, watchlistName } from 'mocks/address/tag';
import * as tokenTransferMock from 'mocks/tokens/tokenTransfer';
import * as decodedInputDataMock from 'mocks/txs/decodedInputData';

export const base: Transaction = {
  base_fee_per_gas: '10000000000',
  block: 29611750,
  confirmation_duration: [
    0,
    6364,
  ],
  confirmations: 508299,
  created_contract: null,
  decoded_input: decodedInputDataMock.withoutIndexedFields,
  exchange_rate: '0.00254428',
  fee: {
    type: 'actual',
    value: '7143168000000000',
  },
  from: {
    hash: '0x047A81aFB05D9B1f8844bf60fcA05DCCFbC584B9',
    implementation_name: null,
    is_contract: false,
    name: null,
    is_verified: null,
    private_tags: [ ],
    public_tags: [ publicTag ],
    watchlist_names: [],
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
    hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
    implementation_name: null,
    is_contract: false,
    is_verified: true,
    name: null,
    private_tags: [ privateTag ],
    public_tags: [],
    watchlist_names: [ watchlistName ],
  },
  token_transfers: [],
  token_transfers_overflow: false,
  tx_burnt_fee: '461030000000000',
  tx_tag: null,
  tx_types: [
    'contract_call',
    'token_transfer',
  ],
  type: 2,
  value: '42000000000000000000',
};

export const withContractCreation: Transaction = {
  ...base,
  to: null,
  created_contract: {
    hash: '0xdda21946FF3FAa027104b15BE6970CA756439F5a',
    implementation_name: null,
    is_contract: true,
    is_verified: null,
    name: 'Shavuha token',
    private_tags: [],
    public_tags: [],
    watchlist_names: [],
  },
};

export const withTokenTransfer: Transaction = {
  ...base,
  to: {
    hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
    implementation_name: null,
    is_contract: true,
    is_verified: true,
    name: 'ArianeeStore',
    private_tags: [ privateTag ],
    public_tags: [],
    watchlist_names: [ watchlistName ],
  },
  token_transfers: [
    tokenTransferMock.erc20,
    tokenTransferMock.erc721,
    tokenTransferMock.erc1155,
    tokenTransferMock.erc1155multiple,
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
    hash: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859',
    implementation_name: null,
    is_verified: true,
    is_contract: true,
    name: 'Bad guy',
    private_tags: [ ],
    public_tags: [],
    watchlist_names: [ ],
  },
};

export const pending: Transaction = {
  ...base,
  base_fee_per_gas: null,
  block: null,
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
  tx_burnt_fee: null,
  tx_tag: null,
  type: null,
  value: '0',
};
