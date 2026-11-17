import type { schemas } from '@blockscout/api-types';

import { base } from 'src/slices/tx/mocks/details';

export const zkSyncTxn: schemas['TransactionResponse'] = {
  ...base,
  zksync: {
    batch_number: 8051,
    commit_transaction_hash: '0x7cd80c88977c2b310f79196b0b2136da18012be015ce80d0d9e9fe6cfad52b16',
    commit_transaction_timestamp: '2022-03-19T09:37:38.726996Z',
    execute_transaction_hash: null,
    execute_transaction_timestamp: null,
    prove_transaction_hash: '0xb424162ba5afe17c710dceb5fc8d15d7d46a66223454dae8c74aa39f6802625b',
    prove_transaction_timestamp: '2022-03-19T10:29:05.279177Z',
    status: 'Validated on L1',
  },
};
