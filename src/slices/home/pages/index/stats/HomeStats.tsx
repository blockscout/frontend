// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid } from '@chakra-ui/react';
import React from 'react';

import { isHomeStatsItemEnabled, sortHomeStatsItems } from 'src/slices/home/utils/stats';

import HomeStatsAverageBlockTime from './widgets/HomeStatsAverageBlockTime';
import HomeStatsBtcLocked from './widgets/HomeStatsBtcLocked';
import HomeStatsCurrentEpoch from './widgets/HomeStatsCurrentEpoch';
import HomeStatsGasTracker from './widgets/HomeStatsGasTracker';
import HomeStatsLatestBatch from './widgets/HomeStatsLatestBatch';
import HomeStatsLatestBlock from './widgets/HomeStatsLatestBlock';
import HomeStatsLatestL1StateBatch from './widgets/HomeStatsLatestL1StateBatch';
import HomeStatsTotalAddresses from './widgets/HomeStatsTotalAddresses';
import HomeStatsTotalOperationalTxs from './widgets/HomeStatsTotalOperationalTxs';
import HomeStatsTotalTxs from './widgets/HomeStatsTotalTxs';

const HomeStats = () => {
  const items = React.useMemo(() => {
    return [
      {
        id: 'latest_batch' as const,
        component: <HomeStatsLatestBatch/>,
      },
      {
        id: 'total_blocks' as const,
        component: <HomeStatsLatestBlock/>,
      },
      {
        id: 'average_block_time' as const,
        component: <HomeStatsAverageBlockTime/>,
      },
      {
        id: 'total_txs' as const,
        component: <HomeStatsTotalTxs/>,
      },
      {
        id: 'total_operational_txs' as const,
        component: <HomeStatsTotalOperationalTxs/>,
      },
      {
        id: 'wallet_addresses' as const,
        component: <HomeStatsTotalAddresses/>,
      },
      {
        id: 'gas_tracker' as const,
        component: <HomeStatsGasTracker/>,
      },
      {
        id: 'latest_l1_state_batch' as const,
        component: <HomeStatsLatestL1StateBatch/>,
      },
      {
        id: 'btc_locked' as const,
        component: <HomeStatsBtcLocked/>,
      },
      {
        id: 'current_epoch' as const,
        component: <HomeStatsCurrentEpoch/>,
      },
    ]
      .filter(Boolean)
      .filter(isHomeStatsItemEnabled)
      .sort(sortHomeStatsItems);
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <Grid
      gridTemplateColumns="1fr 1fr"
      gridGap={{ base: 1, lg: 2 }}
      flexBasis="50%"
      flexGrow={ 1 }
    >
      { items.map(({ id, component }) => {
        return (
          <React.Fragment key={ id }>
            { component }
          </React.Fragment>
        );
      }) }
    </Grid>
  );
};

export default React.memo(HomeStats);
