import type { TokenType } from 'types/api/token';
import type { TokensSortingField, TokensSortingValue, TokensSorting } from 'types/api/tokens';

import type { Query } from 'nextjs-routes';

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

export const BRIDGED_TOKENS_CHAINS = [
  { id: '1', title: 'Ethereum', short_title: 'ETH', base_url: 'https://eth.blockscout.com/token/' },
  { id: '56', title: 'Binance Smart Chain', short_title: 'BSC', base_url: 'https://bscscan.com/token/' },
  { id: '99', title: 'POA', short_title: 'POA', base_url: 'https://blockscout.com/poa/core/token/' },
];

export const BRIDGE_TYPES = [
  { type: 'omni', title: 'OmniBridge', short_title: 'OMNI' },
  { type: 'amb', title: 'Arbitrary Message Bridge', short_title: 'AMB' },
];

export const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPE_IDS);

const BRIDGED_TOKENS_CHAINS_IDS = BRIDGED_TOKENS_CHAINS.map(chain => chain.id);
export const getBridgedChainsFilterValue = (getFilterValuesFromQuery<string>).bind(null, BRIDGED_TOKENS_CHAINS_IDS);

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
