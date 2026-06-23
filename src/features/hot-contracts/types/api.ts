// SPDX-License-Identifier: LicenseRef-Blockscout

import type { operations } from '@blockscout/api-types';

export interface HotContractsFilters {
  scale?: HotContractsInterval;
}

export interface HotContractsSorting {
  sort: NonNullable<operations['StatsController.hot_smart_contracts']['params']['query']['sort']>;
  order: NonNullable<operations['StatsController.hot_smart_contracts']['params']['query']['order']>;
}

export type HotContractsSortingField = HotContractsSorting['sort'];

export type HotContractsSortingValue = `${ HotContractsSortingField }-${ HotContractsSorting['order'] }` | 'default';

export type HotContractsInterval = operations['StatsController.hot_smart_contracts']['params']['query']['scale'];
