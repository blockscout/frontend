// SPDX-License-Identifier: LicenseRef-Blockscout

import type { operations } from '@blockscout/api-types';
import type { ExcludeUndefined } from 'src/shared/types/utils';

export interface TransactionsSorting {
  sort: 'value' | 'fee' | 'block_number';
  order: 'asc' | 'desc';
}

export type TransactionsSortingField = TransactionsSorting['sort'];

export type TransactionsSortingValue = `${ TransactionsSortingField }-${ TransactionsSorting['order'] }` | 'default';

export type TxsStatusFilter = ExcludeUndefined<ExcludeUndefined<operations['TransactionController.transactions']['params']['query']>['filter']>;
export type TxsTypeFilter = ExcludeUndefined<ExcludeUndefined<operations['TransactionController.transactions']['params']['query']>['type']>;

export interface TxsFilters {
  filter?: TxsStatusFilter;
  type?: TxsTypeFilter;
};
