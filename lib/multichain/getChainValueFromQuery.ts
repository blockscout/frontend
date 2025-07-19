import type { Router } from 'next/router';

import multichainConfig from 'configs/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';

export default function getChainValueFromQuery(query: Router['query']) {
  const config = multichainConfig();
  if (!config) {
    return undefined;
  }

  const queryParam = getQueryParamString(query['chain-slug']);
  return queryParam || config.chains[0].slug;
}
