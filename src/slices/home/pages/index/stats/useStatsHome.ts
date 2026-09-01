// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';

import { HOMEPAGE_STATS_MICROSERVICE } from 'src/features/chain-stats/stubs/home';

import config from 'src/config';

const isStatsFeatureEnabled = config.features.stats.isEnabled;

export default function useStatsHome() {
  const statsApiQuery = useApiQuery('stats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: isStatsFeatureEnabled ? HOMEPAGE_STATS_MICROSERVICE : undefined,
      enabled: isStatsFeatureEnabled,
      refetchInterval: (query) => {
        if (query.state.status === 'error') {
          return false;
        }

        return config.apis.stats?.refetchInterval?.[ 'stats:pages_main' ];
      },
    },
  });

  const coreApiQuery = useStatsQuery();

  return React.useMemo(() => {
    return {
      coreApiQuery: coreApiQuery,
      statsApiQuery: statsApiQuery,
    };
  }, [ statsApiQuery, coreApiQuery ]);
}
