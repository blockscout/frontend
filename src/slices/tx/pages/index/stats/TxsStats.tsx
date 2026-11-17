// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';
import { TXS_STATS, TXS_STATS_MICROSERVICE } from 'src/slices/tx/stubs/tx';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';
import StatsContainer from 'src/shared/stats/StatsContainer';
import StatsWidget from 'src/shared/stats/StatsWidget';

import { getTxsStatsWidgets } from './get-txs-stats-widgets';

interface Props extends BoxProps {}

const TxsStats = (props: Props) => {
  const multichainContext = useMultichainContext();

  const chainConfig = multichainContext?.chain.app_config || config;
  const isStatsFeatureEnabled = chainConfig.features.stats.isEnabled;
  const rollupFeature = chainConfig.features.rollup;

  const txsStatsQuery = useApiQuery('stats:pages_transactions', {
    queryOptions: {
      enabled: isStatsFeatureEnabled,
      placeholderData: isStatsFeatureEnabled ? TXS_STATS_MICROSERVICE : undefined,
    },
  });

  const txsStatsApiQuery = useApiQuery('core:txs_stats', {
    queryOptions: {
      enabled: !isStatsFeatureEnabled,
      placeholderData: !isStatsFeatureEnabled ? TXS_STATS : undefined,
    },
  });

  const statsQuery = useStatsQuery();

  const activeQuery = isStatsFeatureEnabled ? txsStatsQuery : txsStatsApiQuery;

  if (!activeQuery.data) {
    return null;
  }

  const widgets = getTxsStatsWidgets({
    isStatsFeatureEnabled,
    rollupType: rollupFeature.isEnabled ? rollupFeature.type : undefined,
    currency: chainConfig.chain.currency,
    chainId: multichainContext?.chain.id,
    microserviceStats: txsStatsQuery.data,
    apiStats: txsStatsApiQuery.data,
    coinPrice: statsQuery.data?.coin_price,
  });

  return (
    <StatsContainer mb={ 6 } { ...props } >
      { widgets.map((widget) => (
        <StatsWidget
          key={ widget.id }
          label={ widget.label }
          value={ widget.value }
          valuePrefix={ widget.valuePrefix }
          valuePostfix={ widget.valuePostfix }
          period={ widget.period }
          isLoading={ activeQuery.isPlaceholderData }
          href={ widget.href }
        />
      )) }
    </StatsContainer>
  );
};

export default React.memo(TxsStats);
