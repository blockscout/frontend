// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { useHomeDataContext } from 'src/slices/home/contexts/home-data-context';
import { useHomeRpcDataContext } from 'src/slices/home/contexts/rpc-data-context';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { RPC_TOOLTIP_CONTENT_NO_VALUE, RPC_TOOLTIP_CONTENT_VALUE } from '../utils';

const HomeStatsLatestBlock = () => {

  const statsQuery = useStatsHome();
  const { blocksQuery } = useHomeDataContext();
  const { enable: enableRpcData, blocks: blocksRpc, isLoading: isLoadingRpc } = useHomeRpcDataContext();

  const isError = blocksQuery?.isError && statsQuery.isError;
  const isLoading = blocksQuery?.isPlaceholderData || statsQuery.isLoading || (isError && isLoadingRpc);

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
    return Number(blocksQuery?.data?.[0]?.height ?? statsQuery.data?.total_blocks).toLocaleString();
  })();

  if (value === undefined) {
    return null;
  }

  const label = blocksQuery?.data?.[0]?.height !== undefined || isError ? 'Latest block' : statsQuery.labels?.total_blocks || 'Total blocks';

  return (
    <Tooltip
      content={ value !== mdash ? RPC_TOOLTIP_CONTENT_VALUE : RPC_TOOLTIP_CONTENT_NO_VALUE }
      disabled={ !(isError && !isLoadingRpc) }
    >
      <HomeStatsWidget
        label={ label }
        icon="block"
        value={ value }
        href={{ pathname: '/blocks' }}
        isLoading={ isLoading }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsLatestBlock);
