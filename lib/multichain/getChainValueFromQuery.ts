import type { Router } from 'next/router';

import multichainConfig from 'configs/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';

export default function getChainValueFromQuery(
  query: Router['query'],
  chainIds?: Array<string>,
  withAllOption?: boolean,
) {
  const config = multichainConfig();
  if (!config) {
    return undefined;
  }

  const chainId = getQueryParamString(query.chain_id);
  const chainSlugOrId = getQueryParamString(query.chain_slug_or_id);

  if (chainId) {
    if (config.chains.some((chain) => chain.id === chainId)) {
      return chainId;
    }
  }

  if (chainSlugOrId) {
    const chain = config.chains.find((chain) => chain.slug === chainSlugOrId || chain.id === chainSlugOrId);
    if (chain) {
      return chain.id;
    }
  }

  if (withAllOption) {
    return 'all';
  }

  return config.chains.filter((chain) => !chainIds || (chain.id && chainIds.includes(chain.id)))?.[0]?.id;
}
