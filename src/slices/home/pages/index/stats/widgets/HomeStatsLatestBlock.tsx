// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { useHomeDataContext } from 'src/slices/home/contexts/home-data-context';
import { useHomeRpcDataContext } from 'src/slices/home/contexts/rpc-data-context';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { getStatsHomeDataItem, RPC_TOOLTIP_CONTENT_NO_VALUE, RPC_TOOLTIP_CONTENT_VALUE } from '../utils';

const HomeStatsLatestBlock = () => {

  const { coreApiQuery, statsApiQuery } = useStatsHome();
  const itemQuery = getStatsHomeDataItem('total_blocks', coreApiQuery, statsApiQuery);

  const { blocksQuery } = useHomeDataContext();
  const { enable: enableRpcData, blocks: blocksRpc, isLoading: isLoadingRpc } = useHomeRpcDataContext();

  const isError = blocksQuery?.isError && itemQuery?.isError;
  const isLoading = blocksQuery?.isPlaceholderData || itemQuery?.isLoading || (isError && isLoadingRpc);

  React.useEffect(() => {
    if (isError) {
      enableRpcData(true, 'stats-widgets-latest-block');
    }
    return () => {
      enableRpcData(false, 'stats-widgets-latest-block');
    };
  }, [ isError, enableRpcData ]);

  const value = (() => {
    if (isError) {
      return blocksRpc[0] ? blocksRpc[0].height.toLocaleString() : mdash;
    }
    const latestBlock = blocksQuery?.data?.[0]?.height ??
      (itemQuery?.id === 'total_blocks' && itemQuery?.data ? itemQuery.data : undefined);
    if (latestBlock !== undefined) {
      return Number(latestBlock).toLocaleString();
    }
  })();

  if (!value) {
    return null;
  }

  const label = (() => {
    if (blocksQuery?.data?.[0]?.height !== undefined || isError) {
      return 'Latest block';
    }
    if (itemQuery?.id === 'total_blocks' && itemQuery?.title) {
      return itemQuery.title;
    }
    return 'Total blocks';
  })();

  const isRpcData = isError && !isLoadingRpc;

  return (
    <Tooltip
      content={ value !== mdash ? RPC_TOOLTIP_CONTENT_VALUE : RPC_TOOLTIP_CONTENT_NO_VALUE }
      disabled={ !isRpcData }
    >
      <HomeStatsWidget
        label={ label }
        icon="block"
        value={ value }
        href={{ pathname: '/blocks' }}
        isLoading={ isLoading }
        isFallback={ isRpcData && value === mdash }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsLatestBlock);
