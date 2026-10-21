// SPDX-License-Identifier: LicenseRef-Blockscout

export interface ZeroValueFilter {
  include_zero_value?: boolean;
}

export interface InternalTransactionFilters extends ZeroValueFilter {
  transaction_hash: string;
}
