// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { UptimeRealTimeData } from 'src/features/chain-variants/mega-eth/types/api';

import StatsContainer from 'src/shared/stats/StatsContainer';
import StatsWidget from 'src/shared/stats/StatsWidget';

interface Props {
  realtimeData: UptimeRealTimeData | null;
}

const UptimeStats = ({ realtimeData }: Props) => {

  return (
    <StatsContainer mb={ 8 }>
      <StatsWidget
        label="Current TPS"
        hint="Number of transactions processed per second on the network"
        value={ realtimeData ? Number(realtimeData.instant_tps).toLocaleString() : '-' }
      />
      <StatsWidget
        label="MGas/s"
        hint="Number of computational gas consumed per second on the network"
        value={ realtimeData ? Number(realtimeData.instant_mgas_per_second).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-' }
      />
      <StatsWidget
        label="Block height"
        hint="Number of blocks created since the genesis block"
        value={ realtimeData ? Number(realtimeData.latest_mini_block_id).toLocaleString() : '-' }
      />
      <StatsWidget
        label="Block time"
        hint="Time taken by the sequencer to produce a new block"
        valuePostfix=" ms"
        value={ realtimeData ? Number(realtimeData.instant_mini_block_interval).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-' }
      />
    </StatsContainer>
  );
};

export default React.memo(UptimeStats);
