import type { TokenType } from 'types/api/token';
import type { TokensSortingValue } from 'types/api/tokens';
import type { SelectOption } from 'ui/shared/select/types';

import config from 'configs/app';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import { TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';

export const SORT_OPTIONS: Array<SelectOption<TokensSortingValue>> = [
  { label: 'Default', value: undefined },
  { label: 'Price ascending', value: 'fiat_value-asc' },
  { label: 'Price descending', value: 'fiat_value-desc' },
  { label: 'Holders ascending', value: 'holder_count-asc' },
  { label: 'Holders descending', value: 'holder_count-desc' },
  { label: 'On-chain market cap ascending', value: 'circulating_market_cap-asc' },
  { label: 'On-chain market cap descending', value: 'circulating_market_cap-desc' },
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
