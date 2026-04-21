import type { CrossChainChainsStatsSortingField, CrossChainChainsStatsSortingValue } from '../types/api';
import { StatsChainsSort } from '@blockscout/interchain-indexer-types';

import type { SelectOption } from 'toolkit/chakra/select';

export const ICTT_USERS_SORT_SEQUENCE: Record<CrossChainChainsStatsSortingField, Array<CrossChainChainsStatsSortingValue>> = {
  [StatsChainsSort.UNIQUE_TRANSFER_USERS_COUNT]: [ 'UNIQUE_TRANSFER_USERS_COUNT-DESC', 'UNIQUE_TRANSFER_USERS_COUNT-ASC', 'default' ],
};

export const ICTT_USERS_SORT_OPTIONS: Array<SelectOption<CrossChainChainsStatsSortingValue>> = [
  { label: 'Default', value: 'default' },
  { label: 'Number of unique ICTT users descending', value: 'UNIQUE_TRANSFER_USERS_COUNT-DESC' },
  { label: 'Number of unique ICTT users ascending', value: 'UNIQUE_TRANSFER_USERS_COUNT-ASC' },
];
