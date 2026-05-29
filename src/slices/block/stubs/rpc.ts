import type { Chain, GetBlockReturnType } from 'viem';

import { ADDRESS_HASH } from 'src/slices/address/stubs/address-params';
import { GET_TRANSACTION } from 'src/slices/tx/stubs/rpc';
import { TX_HASH } from 'src/slices/tx/stubs/tx';

import { WITHDRAWAL } from 'src/features/chain-variants/beacon-chain/stubs/rpc';

import { BLOCK_HASH } from './block';

export const GET_BLOCK: GetBlockReturnType<Chain, false, 'latest'> = {
  baseFeePerGas: BigInt(11),
  difficulty: BigInt(111),
  extraData: '0xd8830',
  gasLimit: BigInt(800000),
  gasUsed: BigInt(42000),
  hash: BLOCK_HASH,
  logsBloom: '0x008000',
  miner: ADDRESS_HASH,
  mixHash: BLOCK_HASH,
  nonce: '0x0000000000000000',
  number: BigInt(10361367),
  parentHash: BLOCK_HASH,
  receiptsRoot: BLOCK_HASH,
  sha3Uncles: BLOCK_HASH,
  size: BigInt(88),
  stateRoot: BLOCK_HASH,
  timestamp: BigInt(1628580000),
  totalDifficulty: BigInt(10361367),
  transactions: [
    TX_HASH,
  ],
  transactionsRoot: TX_HASH,
  uncles: [],
  withdrawals: Array(10).fill(WITHDRAWAL),
  withdrawalsRoot: TX_HASH,
  sealFields: [ '0x00' ],
  blobGasUsed: BigInt(0),
  excessBlobGas: BigInt(0),
};

export const GET_BLOCK_WITH_TRANSACTIONS: GetBlockReturnType<Chain, true, 'latest'> = {
  ...GET_BLOCK,
  transactions: Array(50).fill(GET_TRANSACTION),
};
