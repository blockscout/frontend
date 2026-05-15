import type { Transaction } from 'client/slices/tx/types/api';

import * as addressMock from 'client/slices/address/mocks/address';
import { base } from 'client/slices/tx/mocks/tx';

import * as interopMock from 'client/features/op-interop/mocks/interop';

export const withInteropInMessage: Transaction = {
  ...base,
  op_interop_messages: [ {
    init_chain: interopMock.chain,
    nonce: 1,
    payload: '0x',
    init_transaction_hash: '0x01a8c328b0370068aaaef49c107f70901cd79adcda81e3599a88855532122e09',
    sender_address_hash: addressMock.hash,
    status: 'Sent',
    target_address_hash: addressMock.hash,
  } ],
};

export const withInteropOutMessage: Transaction = {
  ...base,
  op_interop_messages: [ {
    relay_chain: interopMock.chain,
    nonce: 1,
    // eslint-disable-next-line max-len
    payload: '0xfa4b78b90000000000000000000000000000000000000000000000000000000005001bcfe835d1028984e9e6e7d016b77164eacbcc6cc061e9333c0b37982b504f7ea791000000000000000000000000a79b29ad7e0196c95b87f4663ded82fbf2e3add8',
    relay_transaction_hash: '0x01a8c328b0370068aaaef49c107f70901cd79adcda81e3599a88855532122e09',
    sender_address_hash: addressMock.hash,
    status: 'Sent',
    target_address_hash: addressMock.hash,
  } ],
};
