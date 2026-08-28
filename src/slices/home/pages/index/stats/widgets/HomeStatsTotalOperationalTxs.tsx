// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import config from 'src/config';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const rollupFeature = config.features.rollup;

const HomeStatsTotalOperationalTxs = () => {
  const statsQuery = useStatsHome();

  if (!rollupFeature.isEnabled || !(rollupFeature.type === 'arbitrum' || rollupFeature.type === 'optimistic')) {
    return null;
  }

  const value = (() => {
    if (statsQuery.isError) {
      return mdash;
    }
    if (rollupFeature.type === 'arbitrum' && statsQuery.data.total_operational_transactions) {
      return Number(statsQuery.data.total_operational_transactions).toLocaleString();
    }
    if (rollupFeature.type === 'optimistic' && statsQuery.data.op_stack_total_operational_transactions) {
      return Number(statsQuery.data.op_stack_total_operational_transactions).toLocaleString();
    }
  })();

  if (!value) {
    return null;
  }

  const label = (() => {
    if (rollupFeature.type === 'arbitrum') {
      return statsQuery.labels?.total_operational_transactions;
    }
    if (rollupFeature.type === 'optimistic') {
      return statsQuery.labels?.op_stack_total_operational_transactions;
    }
  })();

  return (
    <Tooltip
      content={ RPC_TOOLTIP_CONTENT_NO_VALUE }
      disabled={ !statsQuery.isError }
    >
      <HomeStatsWidget
        label={ label || 'Total operational transactions' }
        icon="transactions"
        value={ value }
        href={{ pathname: '/txs' as const }}
        isLoading={ statsQuery.isLoading }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsTotalOperationalTxs);
