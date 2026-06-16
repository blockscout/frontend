// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Chain, GetBlockReturnType } from 'viem';

import type { schemas } from '@blockscout/api-types';

import { toAddressModel } from 'src/slices/address/utils/model';

import dayjs from 'src/shared/date-and-time/dayjs';

function getBaseBlockData(block: GetBlockReturnType<Chain, false, 'latest'>) {
  return {
    height: Number(block.number),
    timestamp: dayjs.unix(Number(block.timestamp)).format(),
    transactions_count: block.transactions.length,
    internal_transactions_count: 0,
    miner: toAddressModel({ hash: block.miner }),
    size: Number(block.size),
    hash: block.hash,
    parent_hash: block.parentHash,
    difficulty: block.difficulty?.toString() ?? null,
    total_difficulty: block.totalDifficulty?.toString() ?? null,
    gas_used: block.gasUsed.toString(),
    gas_limit: block.gasLimit.toString(),
    nonce: block.nonce,
    base_fee_per_gas: block.baseFeePerGas?.toString() ?? null,
    burnt_fees: null,
    priority_fee: null,
    gas_target_percentage: 0,
    gas_used_percentage: 0,
    burnt_fees_percentage: null,
    type: 'block' as const, // we can't get this type from RPC, so it will always be a regular block
    transaction_fees: '0',
    uncles_hashes: block.uncles.map((uncle) => ({ hash: uncle as string })),
    withdrawals_count: block.withdrawals?.length ?? 0,
    is_pending_update: false,
    rewards: [],
    beacon_deposits_count: 0,
  };
}

export function formatBlockDetailsData(block: GetBlockReturnType<Chain, false, 'latest'> | null): schemas['BlockResponse'] | null {
  if (!block) {
    return null;
  }

  return {
    ...getBaseBlockData(block),
    rewards: [],
  };
}

export function formatBlockListData(block: GetBlockReturnType<Chain, false, 'latest'> | null): schemas['Block'] | null {
  if (!block) {
    return null;
  }

  return {
    ...getBaseBlockData(block),
  };
}
