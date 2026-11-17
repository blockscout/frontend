// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';

import type { schemas } from '@blockscout/api-types';
import type { MainPageStats } from '@blockscout/stats-types';

import config from 'src/config';

const isStatsFeatureEnabled = config.features.stats.isEnabled;
const rollupFeature = config.features.rollup;

export const RPC_TOOLTIP_CONTENT_VALUE = 'Our indexer is experiencing problems, you see the data directly from RPC';
export const RPC_TOOLTIP_CONTENT_NO_VALUE = 'Our indexer is experiencing problems and we couldn\'t get this data directly from RPC';

type StatsHomeDataId = 'total_blocks' |
'average_block_time' |
'total_transactions' |
'total_operational_transactions' |
'op_stack_total_operational_transactions' |
'last_output_root_size' |
'total_addresses' |
'gas_prices' |
'rootstock_locked_btc' |
'celo_epoch_number';

export function getStatsHomeDataItem(
  id: StatsHomeDataId,
  coreApiQuery: UseQueryResult<schemas['StatsResponse'], unknown>,
  statsApiQuery: UseQueryResult<MainPageStats, unknown>,
) {
  const isLoading = (isStatsFeatureEnabled && statsApiQuery.isPlaceholderData) || coreApiQuery.isPlaceholderData;
  const isError = coreApiQuery.isError && (!isStatsFeatureEnabled || (statsApiQuery.isError && !statsApiQuery.isRefetchError));

  switch (id) {
    case 'total_blocks':
      return {
        id,
        data: statsApiQuery.data?.total_blocks?.value ?? coreApiQuery.data?.total_blocks,
        title: statsApiQuery.data?.total_blocks?.title,
        isLoading,
        isError,
      };
    case 'average_block_time':
      return {
        id,
        data: statsApiQuery.data?.average_block_time?.value ??
            (coreApiQuery.data?.average_block_time ? coreApiQuery.data.average_block_time / 1000 : undefined),
        title: statsApiQuery.data?.average_block_time?.title,
        isLoading,
        isError,
      };
    case 'total_transactions':
      return {
        id,
        data: statsApiQuery.data?.total_transactions?.value ?? coreApiQuery.data?.total_transactions,
        title: statsApiQuery.data?.total_transactions?.title,
        isLoading,
        isError,
      };
    case 'total_operational_transactions': {
      if (!rollupFeature.isEnabled) {
        return null;
      }

      if (rollupFeature.type === 'optimistic') {
        return {
          id,
          data: statsApiQuery.data?.op_stack_total_operational_transactions?.value,
          title: statsApiQuery.data?.op_stack_total_operational_transactions?.title,
          isLoading: statsApiQuery.isPlaceholderData,
          isError: statsApiQuery.isError,
        };
      }

      return {
        id,
        data: statsApiQuery.data?.total_operational_transactions?.value,
        title: statsApiQuery.data?.total_operational_transactions?.title,
        isLoading: statsApiQuery.isPlaceholderData,
        isError: statsApiQuery.isError,
      };
    }
    case 'last_output_root_size':
      return {
        id,
        data: coreApiQuery.data?.last_output_root_size,
        isLoading: coreApiQuery.isPlaceholderData,
        isError: coreApiQuery.isError,
      };
    case 'total_addresses':
      return {
        id,
        data: statsApiQuery.data?.total_addresses?.value ?? coreApiQuery.data?.total_addresses,
        title: statsApiQuery.data?.total_addresses?.title,
        isLoading,
        isError,
      };
    case 'gas_prices':
      return {
        id,
        data: {
          gas_prices: coreApiQuery.data?.gas_prices,
          gas_price_updated_at: coreApiQuery.data?.gas_price_updated_at,
          gas_prices_update_in: coreApiQuery.data?.gas_prices_update_in,
        },
        isLoading: coreApiQuery.isPlaceholderData,
        isError: coreApiQuery.isError,
        dataUpdatedAt: coreApiQuery.dataUpdatedAt,
        isRefetchError: coreApiQuery.isRefetchError,
      };
    case 'rootstock_locked_btc':
      return {
        id,
        data: coreApiQuery.data?.rootstock_locked_btc,
        isLoading: coreApiQuery.isPlaceholderData,
        isError: coreApiQuery.isError,
      };
    case 'celo_epoch_number':
      return {
        id,
        data: coreApiQuery.data?.celo?.epoch_number,
        isLoading: coreApiQuery.isPlaceholderData,
        isError: coreApiQuery.isError,
      };
    default:
      return null;
  }
}
