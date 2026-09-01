// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { getStatsHomeDataItem, RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const HomeStatsTotalTxs = () => {
  const { coreApiQuery, statsApiQuery } = useStatsHome();
  const itemQuery = getStatsHomeDataItem('total_transactions', coreApiQuery, statsApiQuery);

  if (!itemQuery || itemQuery.id !== 'total_transactions') {
    return null;
  }

  const value = (() => {
    if (itemQuery.isError) {
      return mdash;
    }
    if (itemQuery.data) {
      return Number(itemQuery.data).toLocaleString();
    }
  })();

  if (!value) {
    return null;
  }

  return (
    <Tooltip
      content={ RPC_TOOLTIP_CONTENT_NO_VALUE }
      disabled={ !itemQuery.isError }
    >
      <HomeStatsWidget
        label={ itemQuery.title || 'Total transactions' }
        icon="transactions"
        value={ value }
        href={{ pathname: '/txs' as const }}
        isLoading={ itemQuery.isLoading }
        isFallback={ itemQuery.isError }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsTotalTxs);
