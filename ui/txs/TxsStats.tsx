import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { TXS_STATS, TXS_STATS_MICROSERVICE } from 'stubs/tx';
import { thinsp } from 'toolkit/utils/htmlEntities';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const isStatsFeatureEnabled = config.features.stats.isEnabled;
const rollupFeature = config.features.rollup;
const isOptimisticRollup = rollupFeature.isEnabled && rollupFeature.type === 'optimistic';
const isArbitrumRollup = rollupFeature.isEnabled && rollupFeature.type === 'arbitrum';

const TxsStats = () => {
  const txsStatsQuery = useApiQuery('stats:pages_transactions', {
    queryOptions: {
      enabled: isStatsFeatureEnabled,
      placeholderData: isStatsFeatureEnabled ? TXS_STATS_MICROSERVICE : undefined,
    },
  });

  const txsStatsApiQuery = useApiQuery('general:txs_stats', {
    queryOptions: {
      enabled: !isStatsFeatureEnabled,
      placeholderData: !isStatsFeatureEnabled ? TXS_STATS : undefined,
    },
  });

  const statsQuery = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  if ((isStatsFeatureEnabled && !txsStatsQuery.data) || (!isStatsFeatureEnabled && !txsStatsApiQuery.data)) {
    return null;
  }

  const isLoading = isStatsFeatureEnabled ? txsStatsQuery.isPlaceholderData : txsStatsApiQuery.isPlaceholderData;

  const txCount24h = isStatsFeatureEnabled ? txsStatsQuery.data?.transactions_24h?.value : txsStatsApiQuery.data?.transactions_count_24h;
  const operationalTxns24hArbitrum = isArbitrumRollup && isStatsFeatureEnabled ? txsStatsQuery.data?.operational_transactions_24h?.value : null;
  const operationalTxns24hOptimistic = isOptimisticRollup && isStatsFeatureEnabled ? txsStatsQuery.data?.op_stack_operational_transactions_24h?.value : null;

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

  const itemsCount = [
    txCount24h,
    operationalTxns24hArbitrum,
    operationalTxns24hOptimistic,
    pendingTxns,
    txFeeSum24h,
    txFeeAvg,
  ].filter(Boolean).length;

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: `repeat(${ itemsCount }, calc(${ 100 / itemsCount }% - 9px))` }}
      rowGap={ 3 }
      columnGap={ 3 }
      mb={ 6 }
    >
      { txCount24h && (
        <StatsWidget
          label={ txsStatsQuery.data?.transactions_24h?.title ?
            getLabelFromTitle(txsStatsQuery.data?.transactions_24h?.title) :
            'Transactions' }
          value={ Number(txCount24h).toLocaleString() }
          period="24h"
          isLoading={ isLoading }
          href={ config.features.stats.isEnabled ? { pathname: '/stats/[id]', query: { id: 'newTxns' } } : undefined }
        />
      ) }
      { operationalTxns24hArbitrum && (
        <StatsWidget
          label={ txsStatsQuery.data?.operational_transactions_24h?.title ?
            getLabelFromTitle(txsStatsQuery.data?.operational_transactions_24h?.title) :
            'Daily op txns' }
          value={ Number(operationalTxns24hArbitrum).toLocaleString() }
          period="24h"
          isLoading={ isLoading }
        />
      ) }
      { operationalTxns24hOptimistic && (
        <StatsWidget
          label={ txsStatsQuery.data?.op_stack_operational_transactions_24h?.title ?
            getLabelFromTitle(txsStatsQuery.data?.op_stack_operational_transactions_24h?.title) :
            'Daily op txns' }
          value={ Number(operationalTxns24hOptimistic).toLocaleString() }
          period="24h"
          isLoading={ isLoading }
        />
      ) }
      { pendingTxns && (
        <StatsWidget
          label={ txsStatsQuery.data?.pending_transactions_30m?.title ?
            getLabelFromTitle(txsStatsQuery.data?.pending_transactions_30m?.title) :
            'Pending transactions' }
          value={ Number(pendingTxns).toLocaleString() }
          period={ isStatsFeatureEnabled ? '30min' : '1h' }
          isLoading={ isLoading }
        />
      ) }
      { txFeeSum24h != null && (
        <StatsWidget
          label={ txsStatsQuery.data?.transactions_fee_24h?.title ?
            getLabelFromTitle(txsStatsQuery.data?.transactions_fee_24h?.title) :
            'Transactions fees' }
          value={ txFeeSum24h.toLocaleString(undefined, { maximumFractionDigits: 2 }) }
          valuePostfix={ thinsp + config.chain.currency.symbol }
          period="24h"
          isLoading={ isLoading }
          href={ config.features.stats.isEnabled ? { pathname: '/stats/[id]', query: { id: 'txnsFee' } } : undefined }
        />
      ) }
      { txFeeAvg && (
        <StatsWidget
          label={ txsStatsQuery.data?.average_transactions_fee_24h?.title ?
            getLabelFromTitle(txsStatsQuery.data?.average_transactions_fee_24h?.title) :
            'Avg. transaction fee' }
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

// remove period from title
function getLabelFromTitle(title: string) {
  return title.replace(/\s*\([^)]*\)\s*$/, '');
}

export default React.memo(TxsStats);
