// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection } from '@chakra-ui/react';

import type { TokensSortingValue } from 'client/slices/token/types/api';
import { getTokenTypes } from 'client/slices/token/utils/token-types';
import type { ClusterChainConfig } from 'types/multichain';

import getFilterValuesFromQuery from 'client/shared/router/get-filter-values-from-query';

import type { SelectOption } from 'toolkit/chakra/select';

export const SORT_OPTIONS: Array<SelectOption<TokensSortingValue>> = [
  { label: 'Default', value: 'default' },
  { label: 'Price ascending', value: 'fiat_value-asc' },
  { label: 'Price descending', value: 'fiat_value-desc' },
  { label: 'Holders ascending', value: 'holders_count-asc' },
  { label: 'Holders descending', value: 'holders_count-desc' },
  { label: 'On-chain market cap ascending', value: 'circulating_market_cap-asc' },
  { label: 'On-chain market cap descending', value: 'circulating_market_cap-desc' },
];

export const TOKENS_SORT_COLLECTION = createListCollection({
  items: SORT_OPTIONS,
});

export const getTokenFilterValue = (
  value: string | Array<string> | undefined,
  chainConfig?: Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'],
) => {
  const tokenTypes = getTokenTypes(false, chainConfig);
  return getFilterValuesFromQuery(Object.keys(tokenTypes), value);
};
