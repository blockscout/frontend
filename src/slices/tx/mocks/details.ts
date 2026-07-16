/* eslint-disable max-len */
import type { schemas } from '@blockscout/api-types';

import * as addressParamMock from 'src/slices/address/mocks/address-param';
import { toAddressModel } from 'src/slices/address/utils/model';
import * as decodedInputDataMock from 'src/slices/log/mocks/decoded-input';
import * as tokenTransferMock from 'src/slices/token-transfer/mocks';

import { publicTag, privateTag, watchlistName } from 'src/features/account/mocks/address-tags';
import { protocolTag } from 'src/features/address-metadata/mocks/tags';

export const base: schemas['TransactionResponse'] = {
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
    implementations: [],
    is_contract: false,
    name: null,
    is_verified: null,
    private_tags: [ ],
    public_tags: [ publicTag ],
    watchlist_names: [],
    ens_domain_name: 'kitty.kitty.cat.eth',
    is_scam: false,
    metadata: null,
    proxy_type: null,
    reputation: 'ok',
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
    hash: addressParamMock.hash,
    implementations: [],
    is_contract: false,
    is_verified: true,
    name: null,
    private_tags: [ privateTag ],
    public_tags: [],
    watchlist_names: [ watchlistName ],
    ens_domain_name: null,
    is_scam: false,
    metadata: null,
    proxy_type: null,
    reputation: 'ok',
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
  has_error_in_internal_transactions: false,
  authorization_list: [],
  fhe_operations_count: 0,
  is_pending_update: false,
};

export const withWatchListNames: schemas['TransactionResponse'] = {
  ...base,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3194',
  from: {
    ...base.from,
    watchlist_names: [
      { label: 'from #1', display_name: 'from utka' },
      { label: 'kitty', display_name: 'kitty kitty kitty cat where are you' },
    ],
  },
  to: toAddressModel({
    ...base.to,
    watchlist_names: [ { label: 'to #1', display_name: 'to utka' } ],
  }),
};

export const withProtocolTag: schemas['TransactionResponse'] = {
  ...base,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3194',
  to: toAddressModel({
    ...base.to,
    metadata: {
      tags: [ protocolTag ],
    },
    private_tags: [],
    watchlist_names: [],
    public_tags: [],
  }),
};

export const withPendingUpdate: schemas['TransactionResponse'] = {
  ...withProtocolTag,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3133',
  is_pending_update: true,
};

export const withContractCreation: schemas['TransactionResponse'] = {
  ...base,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3195',
  to: null,
  created_contract: {
    ...addressParamMock.withoutName,
    hash: '0xdda21946FF3FAa027104b15BE6970CA756439F5a',
    is_contract: true,
    name: 'Shavuha token',
  },
  transaction_types: [
    'contract_creation',
  ],
};

export const withTokenTransfer: schemas['TransactionResponse'] = {
  ...base,
  hash: '0x62d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3196',
  to: {
    ...addressParamMock.withoutName,
    hash: addressParamMock.hash,
    is_contract: true,
    is_verified: true,
    name: 'ArianeeStore',
    private_tags: [ privateTag ],
    watchlist_names: [ watchlistName ],
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

export const withDecodedRevertReason: schemas['TransactionResponse'] = {
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

export const withRawRevertReason: schemas['TransactionResponse'] = {
  ...base,
  status: 'error',
  result: 'Reverted',
  revert_reason: {
    raw: '4f6e6c79206368616972706572736f6e2063616e206769766520726967687420746f20766f74652e',
  },
  to: {
    ...addressParamMock.withoutName,
    hash: addressParamMock.hash,
    is_verified: true,
    is_contract: true,
    name: 'Bad guy',
  },
};

export const withoutRevertReason: schemas['TransactionResponse'] = {
  ...withRawRevertReason,
  revert_reason: {
    raw: null,
  },
};

export const withRevertReasonParam: schemas['TransactionResponse'] = {
  ...base,
  status: 'error',
  result: 'Reverted',
  revert_reason: {
    method_call: 'Error(string reason)',
    method_id: '0x08c379a0',
    parameters: [
      { name: 'reason', type: 'string', value: 'Only chairpersons can vote' },
    ],
  },
};

export const pending: schemas['TransactionResponse'] = {
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
    hash: addressParamMock.hash,
  },
};

export const base3 = {
  ...base,
  hash: '0x12d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
  from: {
    ...base.from,
    hash: addressParamMock.hash,
  },
};

export const base4 = {
  ...base,
  hash: '0x22d597ebcf3e8d60096dd0363bc2f0f5e2df27ba1dacd696c51aa7c9409f3193',
};

export const withRecipientName = {
  ...base,
  to: addressParamMock.withName,
};

export const withRecipientEns = {
  ...base,
  to: addressParamMock.withEns,
};

export const withRecipientNameTag = {
  ...withRecipientEns,
  to: addressParamMock.withNameTag,
};

export const withRecipientContract = {
  ...withRecipientEns,
  to: addressParamMock.contract,
};
