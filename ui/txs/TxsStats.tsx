import { Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { HomeStats } from 'types/api/stats';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import { TXS_STATS } from 'stubs/tx';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const TxsStats = () => {
  const txsStatsQuery = useApiQuery('txs_stats', {
    queryOptions: {
      placeholderData: TXS_STATS,
    },
  });

  const queryClient = useQueryClient();
  const statsData = queryClient.getQueryData<HomeStats>(getResourceKey('stats'));

  if (!txsStatsQuery.data) {
    return null;
  }

  const txFeeAvg = getCurrencyValue({
    value: txsStatsQuery.data.transaction_fees_avg_24h,
    exchangeRate: statsData?.coin_price,
    decimals: String(config.chain.currency.decimals),
    accuracyUsd: 2,
  });

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: 'repeat(4, 1fr)' }}
      rowGap={ 3 }
      columnGap={ 3 }
      mb={ 6 }
    >
      <StatsWidget
        label="Transactions"
        value={ Number(txsStatsQuery.data?.transactions_count_24h).toLocaleString() }
        period="24h"
        isLoading={ txsStatsQuery.isPlaceholderData }
      />
      <StatsWidget
        label="Pending transactions"
        value={ Number(txsStatsQuery.data?.pending_transactions_count).toLocaleString() }
        period="1h"
        isLoading={ txsStatsQuery.isPlaceholderData }
      />
      <StatsWidget
        label="Transactions fees"
        value={
          (Number(txsStatsQuery.data?.transaction_fees_sum_24h) / (10 ** config.chain.currency.decimals))
            .toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ' + config.chain.currency.symbol
        }
        period="24h"
        isLoading={ txsStatsQuery.isPlaceholderData }
      />
      <StatsWidget
        label="Avg. transaction fee"
        value={ txFeeAvg.usd ? txFeeAvg.usd + ' USD' : txFeeAvg.valueStr + ' ' + config.chain.currency.symbol }
        period="24h"
        isLoading={ txsStatsQuery.isPlaceholderData }
      />
    </Box>
  );
};

export default React.memo(TxsStats);
