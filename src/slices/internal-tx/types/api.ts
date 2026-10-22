// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressTxsFilters } from 'src/slices/address/types/api';

export interface ZeroValueFilter {
  include_zero_value?: boolean;
}

export interface InternalTransactionFilters extends ZeroValueFilter {
  transaction_hash: string;
}

export interface AddressInternalTxsFilters extends AddressTxsFilters, ZeroValueFilter {}
