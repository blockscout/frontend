import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import { thinsp } from 'lib/html-entities';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { TXS_STATS, TXS_STATS_MICROSERVICE } from 'stubs/tx';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const isStatsFeatureEnabled = config.features.stats.isEnabled;

const TxsStats = () => {
  const txsStatsQuery = useApiQuery('stats_transactions', {
    queryOptions: {
      enabled: isStatsFeatureEnabled,
      placeholderData: TXS_STATS_MICROSERVICE,
    },
  });

  const txsStatsApiQuery = useApiQuery('txs_stats', {
    queryOptions: {
      enabled: !isStatsFeatureEnabled,
      placeholderData: TXS_STATS,
    },
  });

  const statsQuery = useApiQuery('stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  if ((isStatsFeatureEnabled && !txsStatsQuery.data) || (!isStatsFeatureEnabled && !txsStatsApiQuery.data)) {
    return null;
  }

  const isLoading = isStatsFeatureEnabled ? txsStatsQuery.isPlaceholderData : txsStatsApiQuery.isPlaceholderData;

  const txCount24h = isStatsFeatureEnabled ? txsStatsQuery.data?.transactions_24h?.value : txsStatsApiQuery.data?.transactions_count_24h;

  const pendingTxns = isStatsFeatureEnabled ? txsStatsQuery.data?.pending_transactions_30m?.value : txsStatsApiQuery.data?.pending_transactions_count;

  // in microservice data, fee values are already divided by 10^decimals
  const txFeeSum24h = isStatsFeatureEnabled ?
    Number(txsStatsQuery.data?.transactions_fee_24h?.value) :
    Number(txsStatsApiQuery.data?.transaction_fees_sum_24h) / (10 ** config.chain.currency.decimals);

  const avgFee = isStatsFeatureEnabled ? txsStatsQuery.data?.average_transactions_fee_24h?.value : txsStatsApiQuery.data?.transaction_fees_avg_24h;

  const txFeeAvg = avgFee ? getCurrencyValue({
    value: avgFee,
    exchangeRate: statsQuery.data?.coin_price,
    // in microservice data, fee values are already divided by 10^decimals
    decimals: isStatsFeatureEnabled ? '0' : String(config.chain.currency.decimals),
    accuracyUsd: 2,
  }) : null;

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: 'repeat(4, calc(25% - 9px))' }}
      rowGap={ 3 }
      columnGap={ 3 }
      mb={ 6 }
    >
      { txCount24h && (
        <StatsWidget
          label="Transactions"
          value={ Number(txCount24h).toLocaleString() }
          period="24h"
          isLoading={ isLoading }
          href={ config.features.stats.isEnabled ? { pathname: '/stats/[id]', query: { id: 'newTxns' } } : undefined }
        />
      ) }
      { pendingTxns && (
        <StatsWidget
          label="Pending transactions"
          value={ Number(pendingTxns).toLocaleString() }
          period={ isStatsFeatureEnabled ? '30min' : '1h' }
          isLoading={ isLoading }
        />
      ) }
      { txFeeSum24h && (
        <StatsWidget
          label="Transactions fees"
          value={ txFeeSum24h.toLocaleString(undefined, { maximumFractionDigits: 2 }) }
          valuePostfix={ thinsp + config.chain.currency.symbol }
          period="24h"
          isLoading={ isLoading }
          href={ config.features.stats.isEnabled ? { pathname: '/stats/[id]', query: { id: 'txnsFee' } } : undefined }
        />
      ) }
      { txFeeAvg && (
        <StatsWidget
          label="Avg. transaction fee"
          value={ txFeeAvg.usd ? txFeeAvg.usd : txFeeAvg.valueStr }
          valuePrefix={ txFeeAvg.usd ? '$' : undefined }
          valuePostfix={ txFeeAvg.usd ? undefined : thinsp + config.chain.currency.symbol }
          period="24h"
          isLoading={ isLoading }
          href={ config.features.stats.isEnabled ? { pathname: '/stats/[id]', query: { id: 'averageTxnFee' } } : undefined }
        />
      ) }
    </Box>
  );
};

export default React.memo(TxsStats);
