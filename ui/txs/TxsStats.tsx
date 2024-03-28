import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { TXS_STATS } from 'stubs/tx';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const TxsStats = () => {
  const txsStatsQuery = useApiQuery('txs_stats', {
    queryOptions: {
      placeholderData: TXS_STATS,
    },
  });

  if (!txsStatsQuery.data) {
    return null;
  }

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
        value={
          (Number(txsStatsQuery.data?.transaction_fees_avg_24h) / (10 ** config.chain.currency.decimals))
            .toLocaleString(undefined, { maximumSignificantDigits: 2 }) + ' ' + config.chain.currency.symbol
        }
        period="24h"
        isLoading={ txsStatsQuery.isPlaceholderData }
      />
    </Box>
  );
};

export default React.memo(TxsStats);
