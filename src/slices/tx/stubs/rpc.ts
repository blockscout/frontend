import type { Chain, GetTransactionReturnType, TransactionReceipt } from 'viem';

import { ADDRESS_HASH } from 'src/slices/address/stubs/address-params';
import { BLOCK_HASH } from 'src/slices/block/stubs/list';
import { TX_HASH } from 'src/slices/tx/stubs/tx';

export const GET_TRANSACTION: GetTransactionReturnType<Chain, 'latest'> = {
  blockHash: BLOCK_HASH,
  blockNumber: BigInt(10361367),
  from: ADDRESS_HASH,
  gas: BigInt(800000),
  maxPriorityFeePerGas: BigInt(2),
  maxFeePerGas: BigInt(14),
  hash: TX_HASH,
  input: '0x7898e0',
  nonce: 117694,
  to: ADDRESS_HASH,
  transactionIndex: 60,
  value: BigInt(42),
  type: 'eip1559',
  accessList: [],
  chainId: 5,
  v: BigInt(0),
  r: '0x2c5022ff7f78a22f1a99afbd568f75cb52812189ed8c264c8310e0b8dba2c8a8',
  s: '0x50938f87c92b9eeb9777507ca8f7397840232d00d1dbac3edac6c115b4656763',
  yParity: 1,
  typeHex: '0x2',
};

export const GET_TRANSACTION_RECEIPT: TransactionReceipt = {
  blockHash: BLOCK_HASH,
  blockNumber: BigInt(10361367),
  contractAddress: null,
  cumulativeGasUsed: BigInt(39109),
  effectiveGasPrice: BigInt(13),
  from: ADDRESS_HASH,
  gasUsed: BigInt(39109),
  logs: [],
  logsBloom: '0x0',
  status: 'success',
  to: ADDRESS_HASH,
  transactionHash: TX_HASH,
  transactionIndex: 60,
  type: '0x2',
};

export const GET_TRANSACTION_CONFIRMATIONS = BigInt(420);
