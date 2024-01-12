import type { TokenType } from 'types/api/token';
import type { TokensSortingValue } from 'types/api/tokens';

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
