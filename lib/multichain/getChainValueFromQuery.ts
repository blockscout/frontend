import type { Router } from 'next/router';

import multichainConfig from 'configs/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';

import getChainSlugFromId from './getChainSlugFromId';

export default function getChainValueFromQuery(
  query: Router['query'],
  chainIds?: Array<string>,
  withAllOption?: boolean,
  field: 'chain-slug' | 'chain_id' = 'chain-slug',
) {
  const config = multichainConfig();
  if (!config) {
    return undefined;
  }

  const queryParam = getQueryParamString(query[field]);
  if (queryParam) {
    if (field === 'chain-slug' && config.chains.some((chain) => chain.slug === queryParam)) {
      return queryParam;
    } else if (field === 'chain_id' && config.chains.some((chain) => chain.config.chain.id === queryParam)) {
      return getChainSlugFromId(queryParam);
    }
  }

  if (withAllOption) {
    return 'all';
  }

  return config.chains.filter((chain) => !chainIds || (chain.config.chain.id && chainIds.includes(chain.config.chain.id)))?.[0].slug;
}
