import React from 'react';

import type { SearchResultUniversalProfile } from '../../types/api/search';
import type { UniversalProfileProxyResponse } from '../../types/api/universalProfile';

import type { Params as FetchParams } from 'lib/hooks/useFetch';

import { algoliaIndex } from './buildUniversalProfileUrl';
import type { ResourceName, ResourcePathParams } from './resources';

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
}

export default function useUniversalProfileApiFetch() {
  return React.useCallback(async(queryParams: string,
  ) => {
    try {
      const { hits } = await algoliaIndex.search(queryParams);
      return hits.map<SearchResultUniversalProfile>((hit) => {
        const hitAsUp = hit as unknown as UniversalProfileProxyResponse;
        return {
          type: 'universal_profile',
          name: hitAsUp.hasProfileName ? hitAsUp.LSP3Profile.name : null,
          address: hit.objectID,
        };
      });
    } catch (error) {
      return error;
    }
  }, []);
}
