// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { TXS_STATS_MICROSERVICE } from 'src/slices/tx/stubs/tx';

import config from 'src/config';
import getStatsLabelFromTitle from 'src/shared/stats/get-stats-label-from-title';
import StatsContainer from 'src/shared/stats/StatsContainer';
import StatsWidget from 'src/shared/stats/StatsWidget';

interface Props extends BoxProps {}

const ZetaChainCCTXsStats = (props: Props) => {
  const isStatsFeatureEnabled = config.features.stats.isEnabled;

  const txsStatsQuery = useApiQuery('stats:pages_transactions', {
    queryOptions: {
      enabled: isStatsFeatureEnabled,
      placeholderData: isStatsFeatureEnabled ? TXS_STATS_MICROSERVICE : undefined,
    },
  });

  if (!txsStatsQuery.data) {
    return null;
  }

  const isLoading = txsStatsQuery.isPlaceholderData;

  const cctxCountTotal = txsStatsQuery.data?.total_zetachain_cross_chain_txns;
  const cctxPendingCountTotal = txsStatsQuery.data?.pending_zetachain_cross_chain_txns;
  const cctxCount24h = txsStatsQuery.data?.new_zetachain_cross_chain_txns_24h;

  return (
    <StatsContainer
      mb={ 6 }
      { ...props }
    >
      { cctxCountTotal && (
        <StatsWidget
          label={ getStatsLabelFromTitle(cctxCountTotal.title) }
          value={ Number(cctxCountTotal.value).toLocaleString() }
          isLoading={ isLoading }
        />
      ) }
      { cctxPendingCountTotal && (
        <StatsWidget
          label={ getStatsLabelFromTitle(cctxPendingCountTotal.title) }
          value={ Number(cctxPendingCountTotal.value).toLocaleString() }
          isLoading={ isLoading }
        />
      ) }
      { cctxCount24h && (
        <StatsWidget
          label={ getStatsLabelFromTitle(cctxCount24h.title) }
          value={ Number(cctxCount24h.value).toLocaleString() }
          period="24h"
          isLoading={ isLoading }
        />
      ) }
    </StatsContainer>
  );
};

export default React.memo(ZetaChainCCTXsStats);
