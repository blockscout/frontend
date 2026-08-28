// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { useHomeDataContext } from 'src/slices/home/contexts/home-data-context';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import { RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const HomeStatsLatestBatch = () => {
  const { latestBatchQuery } = useHomeDataContext();

  if (!latestBatchQuery) {
    return null;
  }

  const value = (() => {
    if (latestBatchQuery.isError) {
      return mdash;
    }
    return Number(latestBatchQuery.data).toLocaleString();
  })();

  return (
    <Tooltip
      content={ RPC_TOOLTIP_CONTENT_NO_VALUE }
      disabled={ !latestBatchQuery.isError }
    >
      <HomeStatsWidget
        label="Latest batch"
        icon="txn_batches"
        value={ value }
        href={{ pathname: '/batches' as const }}
        isLoading={ latestBatchQuery.isPlaceholderData }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsLatestBatch);
