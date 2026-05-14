// SPDX-License-Identifier: LicenseRef-Blockscout

import type {
  OptimisticL2BatchDataContainer,
  OptimisticL2BlobTypeCelestia,
  OptimisticL2BlobTypeEip4844,
  OptimisticL2WithdrawalClaimInfo,
  OptimisticL2WithdrawalStatus,
} from 'types/api/optimisticL2';

export interface OpWithdrawal extends OptimisticL2WithdrawalClaimInfo {
  l1_transaction_hash: string;
  nonce: number;
  status: OptimisticL2WithdrawalStatus;
}

export interface TransactionOptimistic {
  op_withdrawals?: Array<OpWithdrawal>;
  operator_fee?: string;
}

export interface OptimismBlockData {
  batch_data_container: OptimisticL2BatchDataContainer;
  number: number;
  blobs: Array<OptimisticL2BlobTypeEip4844> | Array<OptimisticL2BlobTypeCelestia> | null;
  l1_timestamp: string;
  l1_transaction_hashes: Array<string>;
}

export interface BlockOptimism {
  optimism?: OptimismBlockData;
}
