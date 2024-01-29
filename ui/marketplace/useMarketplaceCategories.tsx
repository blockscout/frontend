import { useQuery } from '@tanstack/react-query';
import _groudBy from 'lodash/groupBy';
import React from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFeatureValue from 'lib/growthbook/useFeatureValue';
import useApiFetch from 'lib/hooks/useFetch';

const feature = config.features.marketplace;
const categoriesUrl = (feature.isEnabled && feature.categoriesUrl) || '';

export default function useMarketplaceCategories(apps: Array<MarketplaceAppOverview>) {
  const apiFetch = useApiFetch();
  const { value: isExperiment } = useFeatureValue('marketplace_exp', true);

  const { isPlaceholderData, data } = useQuery<unknown, ResourceError<unknown>, Array<string>>({
    queryKey: [ 'marketplace-categories' ],
    queryFn: async() => apiFetch(categoriesUrl, undefined, { resource: 'marketplace-categories' }),
    placeholderData: categoriesUrl ? Array(9).fill('Bridge').map((c, i) => c + i) : undefined,
    staleTime: Infinity,
    enabled: Boolean(categoriesUrl),
  });

  const categories = React.useMemo(() => {
    let categoryNames: Array<string> = [];
    const grouped = _groudBy(apps, app => app.categories);

    if (data?.length && isExperiment) {
      categoryNames = data;
    } else {
      categoryNames = Object.keys(grouped);
    }

    return categoryNames
      .map(category => ({ name: category, count: grouped[category]?.length || 0 }))
      .filter(c => c.count > 0);
  }, [ apps, data, isExperiment ]);

  return React.useMemo(() => ({
    isPlaceholderData,
    data: categories,
  }), [ isPlaceholderData, categories ]);
}
