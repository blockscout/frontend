// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQuery } from '@tanstack/react-query';

import type { MarketplaceApp } from '../types/client';

import useApiFetch from 'src/api/hooks/useApiFetch';
import useFetch from 'src/api/hooks/useFetch';
import type { ResourceError } from 'src/api/resources';

import config from 'src/config';

import { useUpdateEffect } from 'src/toolkit/hooks/useUpdateEffect';

import { MARKETPLACE_APP } from '../stubs';

const feature = config.features.marketplace;

export default function useAppQuery(id: string, isAuth: boolean = false) {
  const apiFetch = useApiFetch();
  const fetch = useFetch();

  const query = useQuery<unknown, ResourceError<unknown>, MarketplaceApp>({
    queryKey: [ 'marketplace-dapps', id ],
    queryFn: async() => {
      if (!feature.isEnabled) {
        return null;
      }
      if ('configUrl' in feature) {
        const result = await fetch<Array<MarketplaceApp>, unknown>(feature.configUrl, undefined, { resource: 'marketplace-dapps' });
        if (!Array.isArray(result)) {
          throw result;
        }
        const item = result.find((app) => app.id === id);
        if (!item) {
          throw { status: 404 };
        }
        return item;
      }
      return apiFetch('admin:marketplace_dapp', { pathParams: { instanceId: config.apis.admin?.instanceId, dappId: id } });
    },
    enabled: feature.isEnabled,
    placeholderData: MARKETPLACE_APP,
  });

  const { refetch } = query;

  useUpdateEffect(() => {
    refetch();
  }, [ isAuth, refetch ]);

  return query;
}
