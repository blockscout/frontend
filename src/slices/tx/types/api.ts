// SPDX-License-Identifier: LicenseRef-Blockscout

import type { operations } from '@blockscout/api-types';

export interface TransactionsSorting {
  sort: 'value' | 'fee' | 'block_number';
  order: 'asc' | 'desc';
}

export type TransactionsSortingField = TransactionsSorting['sort'];

export type TransactionsSortingValue = `${ TransactionsSortingField }-${ TransactionsSorting['order'] }` | 'default';

export type TxsStatusFilter = Exclude<Exclude<operations['TransactionController.transactions']['params']['query'], undefined>['filter'], undefined>;
export type TxsTypeFilter = Exclude<Exclude<operations['TransactionController.transactions']['params']['query'], undefined>['type'], undefined>;

export interface TxsFilters {
  filter?: TxsStatusFilter;
  type?: TxsTypeFilter;
};

export interface TxOgDescriptionParams {
  tx_status: string;
  tx_action: string;
  tx_timestamp: string;
}
