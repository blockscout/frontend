import type { Router } from 'next/router';

import multichainConfig from 'configs/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';

export default function getChainValueFromQuery(query: Router['query'], chainIds?: Array<string>) {
  const config = multichainConfig();
  if (!config) {
    return undefined;
  }

  const queryParam = getQueryParamString(query['chain-slug']);
  return queryParam ||
    config.chains.filter((chain) => !chainIds || (chain.config.chain.id && chainIds.includes(chain.config.chain.id)))?.[0].slug;
}
