import type { ZkEvmL2TxnBatch } from 'types/api/zkEvmL2';

export const txnBatchData: ZkEvmL2TxnBatch = {
  acc_input_hash: '0x4bf88aabe33713b7817266d7860912c58272d808da7397cdc627ca53b296fad3',
  global_exit_root: '0xad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5',
  number: 5,
  sequence_tx_hash: '0x7ae010e9758441b302db10282807358af460f38c49c618d26a897592f64977f7',
  state_root: '0x183b4a38a4a6027947ceb93b323cc94c548c8c05cf605d73ca88351d77cae1a3',
  status: 'Finalized',
  timestamp: '2023-10-20T10:08:18.000000Z',
  transactions: [
    '0xb5d432c270057c223b973f3b5f00dbad32823d9ef26f3e8d97c819c7c573453a',
  ],
  verify_tx_hash: '0x6f7eeaa0eb966e63d127bba6bf8f9046d303c2a1185b542f0b5083f682a0e87f',
};
