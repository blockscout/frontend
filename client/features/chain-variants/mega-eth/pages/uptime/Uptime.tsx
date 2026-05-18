// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import PageTitle from 'ui/shared/Page/PageTitle';

import useUptimeSocketData from '../../hooks/useUptimeSocketData';
import UptimeCharts from './UptimeCharts';
import UptimeStats from './UptimeStats';
import UptimeStatus from './UptimeStatus';

const Uptime = () => {

  const { realtimeData, historyData, status, onReconnect } = useUptimeSocketData();

  return (
    <>
      <PageTitle
        title="Uptime"
        contentAfter={ <UptimeStatus status={ status } onReconnect={ onReconnect }/> }
      />
      <UptimeStats realtimeData={ realtimeData }/>
      <UptimeCharts historyData={ historyData } isLoading={ status === 'initial' }/>
    </>
  );
};

export default React.memo(Uptime);
