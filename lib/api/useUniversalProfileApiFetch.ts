import React from 'react';

import type { SearchResultAddressOrContractOrUniversalProfile } from '../../types/api/search';
import type { UniversalProfileProxyResponse } from '../../types/api/universalProfile';

import type { Params as FetchParams } from 'lib/hooks/useFetch';

import { algoliaIndex } from './buildUniversalProfileUrl';
import { isUniversalProfileEnabled } from './isUniversalProfileEnabled';
import type { ResourceName, ResourcePathParams } from './resources';

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal'>;
}

export default function useUniversalProfileApiFetch() {
  return React.useCallback(async(queryParams: string,
  ) => {
    if (!isUniversalProfileEnabled()) {
      return [] as Array<SearchResultAddressOrContractOrUniversalProfile>;
    }
    try {
      const { hits } = await algoliaIndex.search(queryParams);
      return hits.map<SearchResultAddressOrContractOrUniversalProfile>((hit) => {
        const hitAsUp = hit as unknown as UniversalProfileProxyResponse;
        return {
          type: 'universal_profile',
          name: hitAsUp.hasProfileName ? hitAsUp.LSP3Profile.name : null,
          address: hit.objectID,
          is_smart_contract_verified: false,
        };
      });
    } catch (error) {
      return error;
    }
  }, []);
}
