// SPDX-License-Identifier: LicenseRef-Blockscout

export interface SearchResultUserOp {
  type: 'user_operation';
  user_operation_hash: string;
  timestamp: string;
  url?: string;
}

export type UserOpsFilters = {
  transaction_hash?: string;
  sender?: string;
};
