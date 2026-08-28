// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const HomeStatsTotalTxs = () => {
  const statsQuery = useStatsHome();

  const value = (() => {
    if (statsQuery.isError) {
      return mdash;
    }
    return Number(statsQuery.data?.total_transactions).toLocaleString();
  })();

  return (
    <Tooltip
      content={ RPC_TOOLTIP_CONTENT_NO_VALUE }
      disabled={ !statsQuery.isError }
    >
      <HomeStatsWidget
        label={ statsQuery.labels?.total_transactions || 'Total transactions' }
        icon="transactions"
        value={ value }
        href={{ pathname: '/txs' as const }}
        isLoading={ statsQuery.isLoading }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsTotalTxs);
