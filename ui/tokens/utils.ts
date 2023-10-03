import type { TokenType } from 'types/api/token';
import type { TokensSortingField, TokensSortingValue, TokensSorting } from 'types/api/tokens';

import type { Query } from 'nextjs-routes';

import config from 'configs/app';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import { TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import type { Option } from 'ui/shared/sort/Sort';

export const SORT_OPTIONS: Array<Option<TokensSortingValue>> = [
  { title: 'Default', id: undefined },
  { title: 'Price ascending', id: 'fiat_value-asc' },
  { title: 'Price descending', id: 'fiat_value-desc' },
  { title: 'Holders ascending', id: 'holder_count-asc' },
  { title: 'Holders descending', id: 'holder_count-desc' },
  { title: 'On-chain market cap ascending', id: 'circulating_market_cap-asc' },
  { title: 'On-chain market cap descending', id: 'circulating_market_cap-desc' },
];

export const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPE_IDS);

const bridgedTokensChainIds = (() => {
  const feature = config.features.bridgedTokens;
  if (!feature.isEnabled) {
    return [];
  }

  return feature.chains.map(chain => chain.id);
})();
export const getBridgedChainsFilterValue = (getFilterValuesFromQuery<string>).bind(null, bridgedTokensChainIds);

export const getSortValueFromQuery = (query: Query): TokensSortingValue | undefined => {
  if (!query.sort || !query.order) {
    return undefined;
  }

  const str = query.sort + '-' + query.order;
  if (SORT_OPTIONS.map(option => option.id).includes(str)) {
    return str as TokensSortingValue;
  }
};

export const getSortParamsFromValue = (val?: TokensSortingValue): TokensSorting | undefined => {
  if (!val) {
    return undefined;
  }
  const sortingChunks = val.split('-') as [ TokensSortingField, TokensSorting['order'] ];
  return { sort: sortingChunks[0], order: sortingChunks[1] };
};
