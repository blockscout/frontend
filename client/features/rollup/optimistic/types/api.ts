import type { OptimisticL2WithdrawalClaimInfo, OptimisticL2WithdrawalStatus } from 'types/api/optimisticL2';

export interface OpWithdrawal extends OptimisticL2WithdrawalClaimInfo {
  l1_transaction_hash: string;
  nonce: number;
  status: OptimisticL2WithdrawalStatus;
}

export interface TransactionOptimistic {
  op_withdrawals?: Array<OpWithdrawal>;
  operator_fee?: string;
}
