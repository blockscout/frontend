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

  return React.useMemo(() => ({
    isLoading: (isStatsFeatureEnabled && statsApiQuery.isPlaceholderData) || coreApiQuery.isPlaceholderData,
    isError: coreApiQuery.isError && (!isStatsFeatureEnabled || (statsApiQuery.isError && !statsApiQuery.isRefetchError)),
    data: {
      total_blocks: statsApiQuery.data?.total_blocks?.value ?? coreApiQuery.data?.total_blocks,
      average_block_time: statsApiQuery.data?.average_block_time?.value ??
        (coreApiQuery.data?.average_block_time ? coreApiQuery.data.average_block_time / 1000 : undefined),
      total_transactions: statsApiQuery.data?.total_transactions?.value ?? coreApiQuery.data?.total_transactions,
      total_operational_transactions: statsApiQuery.data?.total_operational_transactions?.value,
      op_stack_total_operational_transactions: statsApiQuery.data?.op_stack_total_operational_transactions?.value,
      last_output_root_size: coreApiQuery.data?.last_output_root_size,
      total_addresses: statsApiQuery.data?.total_addresses?.value ?? coreApiQuery.data?.total_addresses,
      gas_prices: coreApiQuery.data?.gas_prices,
      gas_price_updated_at: coreApiQuery.data?.gas_price_updated_at,
      gas_prices_update_in: coreApiQuery.data?.gas_prices_update_in,
      rootstock_locked_btc: coreApiQuery.data?.rootstock_locked_btc,
      celo_epoch_number: coreApiQuery.data?.celo?.epoch_number,
    },
    dataUpdatedAt: coreApiQuery.dataUpdatedAt, // used only for gas tracker tooltip
    isRefetchError: coreApiQuery.isRefetchError, // used only for gas tracker tooltip
    labels: {
      total_blocks: statsApiQuery.data?.total_blocks?.title,
      average_block_time: statsApiQuery.data?.average_block_time?.title,
      total_transactions: statsApiQuery.data?.total_transactions?.title,
      total_operational_transactions: statsApiQuery.data?.op_stack_total_operational_transactions?.title,
      op_stack_total_operational_transactions: statsApiQuery.data?.op_stack_total_operational_transactions?.title,
      total_addresses: statsApiQuery.data?.total_addresses?.title,
    },
  }), [ statsApiQuery, coreApiQuery ]);
}
