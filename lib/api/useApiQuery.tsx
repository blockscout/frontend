import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { ChainConfig } from 'types/multichain';

import multichainConfig from 'configs/multichain';
import { useMultichainContext } from 'lib/contexts/multichain';
import type { Params as FetchParams } from 'lib/hooks/useFetch';

import type { ResourceError, ResourceName, ResourcePathParams, ResourcePayload } from './resources';
import useApiFetch from './useApiFetch';

export interface Params<R extends ResourceName, E = unknown, D = ResourcePayload<R>> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | boolean | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'headers'>;
  queryOptions?: Partial<Omit<UseQueryOptions<ResourcePayload<R>, ResourceError<E>, D>, 'queryFn'>>;
  logError?: boolean;
  chainSlug?: string;
  chain?: ChainConfig;
}

export interface GetResourceKeyParams<R extends ResourceName, E = unknown, D = ResourcePayload<R>>
  extends Pick<Params<R, E, D>, 'pathParams' | 'queryParams'> {
  chainSlug?: string;
}

export function getResourceKey<R extends ResourceName>(resource: R, { pathParams, queryParams, chainSlug }: GetResourceKeyParams<R> = {}) {
  if (pathParams || queryParams) {
    return [ resource, chainSlug, { ...pathParams, ...queryParams } ].filter(Boolean);
  }

  return [ resource, chainSlug ].filter(Boolean);
}

export default function useApiQuery<R extends ResourceName, E = unknown, D = ResourcePayload<R>>(
  resource: R,
  { queryOptions, pathParams, queryParams, fetchParams, logError, chainSlug, chain: chainProp }: Params<R, E, D> = {},
) {
  const apiFetch = useApiFetch();
  const { chain } = useMultichainContext() || (chainProp && { chain: chainProp }) ||
    { chain: chainSlug ? multichainConfig()?.chains.find((chain) => chain.slug === chainSlug) : undefined };

  return useQuery<ResourcePayload<R>, ResourceError<E>, D>({
    queryKey: queryOptions?.queryKey || getResourceKey(resource, { pathParams, queryParams, chainSlug: chain?.slug }),
    queryFn: async({ signal }) => {
      // all errors and error typing is handled by react-query
      // so error response will never go to the data
      // that's why we are safe here to do type conversion "as Promise<ResourcePayload<R>>"
      return apiFetch(resource, { pathParams, queryParams, chain, logError, fetchParams: { ...fetchParams, signal } }) as Promise<ResourcePayload<R>>;
    },
    ...queryOptions,
  });
}
