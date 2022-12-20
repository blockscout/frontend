import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { UserInfo, CustomAbis, PublicTags, AddressTags, TransactionTags, ApiKeys, WatchlistAddress } from 'types/api/account';
import type { CsrfData } from 'types/client/account';

import type { RESOURCES, ResourceError } from './resources';
import type { Params as ApiFetchParams } from './useApiFetch';
import useApiFetch from './useApiFetch';

interface Params<R extends keyof typeof RESOURCES> extends ApiFetchParams {
  queryOptions?: Omit<UseQueryOptions<unknown, ResourceError, ResourcePayload<R>>, 'queryKey' | 'queryFn'>;
}

export default function useApiQuery<R extends keyof typeof RESOURCES>(
  resource: R,
  { queryOptions, pathParams, queryParams, fetchParams }: Params<R> = {},
) {
  const apiFetch = useApiFetch();

  return useQuery<unknown, ResourceError, ResourcePayload<R>>([ resource ], async() => {
    return apiFetch<R, ResourcePayload<R>, ResourceError>(resource, { pathParams, queryParams, fetchParams });
  }, queryOptions);
}

export type ResourcePayload<Q extends keyof typeof RESOURCES> =
  Q extends 'user_info' ? UserInfo :
    Q extends 'csrf' ? CsrfData :
      Q extends 'custom_abi' ? CustomAbis :
        Q extends 'public_tags' ? PublicTags :
          Q extends 'private_tags_address' ? AddressTags :
            Q extends 'private_tags_tx' ? TransactionTags :
              Q extends 'api_keys' ? ApiKeys :
                Q extends 'watchlist' ? Array<WatchlistAddress> :
                  never;
