import type { CrossChainChainsStatsSortingField, CrossChainChainsStatsSortingValue } from '../types/api';

import type { SelectOption } from 'toolkit/chakra/select';

export const ICTT_USERS_SORT_SEQUENCE: Record<CrossChainChainsStatsSortingField, Array<CrossChainChainsStatsSortingValue>> = {
  unique_transfer_users_count: [ 'unique_transfer_users_count-DESC', 'unique_transfer_users_count-ASC', 'default' ],
};

export const ICTT_USERS_SORT_OPTIONS: Array<SelectOption<CrossChainChainsStatsSortingValue>> = [
  { label: 'Default', value: 'default' },
  { label: 'Number of unique ICTT users descending', value: 'unique_transfer_users_count-DESC' },
  { label: 'Number of unique ICTT users ascending', value: 'unique_transfer_users_count-ASC' },
];
