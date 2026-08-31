// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { useHomeRpcDataContext } from 'src/slices/home/contexts/rpc-data-context';

import dayjs from 'src/shared/date-and-time/dayjs';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { getStatsHomeDataItem, RPC_TOOLTIP_CONTENT_NO_VALUE, RPC_TOOLTIP_CONTENT_VALUE } from '../utils';

const HomeStatsAverageBlockTime = () => {

  const [ rpcData, setRpcData ] = React.useState<number | undefined>(undefined);

  const { coreApiQuery, statsApiQuery } = useStatsHome();
  const itemQuery = getStatsHomeDataItem('average_block_time', coreApiQuery, statsApiQuery);
  const { enable: enableRpcData, blocks: blocksRpc, isLoading: isLoadingRpc } = useHomeRpcDataContext();

  const isError = itemQuery?.isError;

  React.useEffect(() => {
    if (isError) {
      enableRpcData(true, 'stats-widgets-average-block-time');
    }
    return () => {
      enableRpcData(false, 'stats-widgets-average-block-time');
    };
  }, [ isError, enableRpcData ]);

  React.useEffect(() => {
    if (blocksRpc.length > 1) {
      const timeDiffs = blocksRpc
        .map((block, index) => {
          if (index > 0) {
            return dayjs(blocksRpc[index - 1].timestamp).diff(dayjs(block.timestamp), 'seconds');
          }
          return 0;
        })
        .slice(1);
      const totalDiff = timeDiffs.reduce((acc, diff) => acc + diff, 0);
      setRpcData((prev) => {
        if (prev === undefined) {
          return totalDiff / timeDiffs.length;
        }
        return (prev + totalDiff) / (timeDiffs.length + 1);
      });
    }
  }, [ blocksRpc ]);

  if (!itemQuery || itemQuery.id !== 'average_block_time') {
    return null;
  }

  const isLoading = itemQuery.isLoading || (isError && isLoadingRpc);

  const value = (() => {
    if (isError) {
      return rpcData ? `${ rpcData.toFixed(1) }s` : mdash;
    }
    if (itemQuery.data) {
      return `${ Number(itemQuery.data).toFixed(1) }s`;
    }
  })();

  if (!value) {
    return null;
  }

  const isRpcData = isError && !isLoadingRpc;

  return (
    <Tooltip
      content={ value !== mdash ? RPC_TOOLTIP_CONTENT_VALUE : RPC_TOOLTIP_CONTENT_NO_VALUE }
      disabled={ !isRpcData }
    >
      <HomeStatsWidget
        label={ itemQuery.title || 'Average block time' }
        icon="clock-light"
        value={ value }
        isLoading={ isLoading }
        isFallback={ isRpcData && value === mdash }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsAverageBlockTime);
