// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import config from 'src/config';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { getStatsHomeDataItem, RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const rollupFeature = config.features.rollup;

const HomeStatsTotalOperationalTxs = () => {
  const { coreApiQuery, statsApiQuery } = useStatsHome();
  const itemQuery = getStatsHomeDataItem('total_operational_transactions', coreApiQuery, statsApiQuery);

  if (!rollupFeature.isEnabled || !(rollupFeature.type === 'arbitrum' || rollupFeature.type === 'optimistic')) {
    return null;
  }

  if (!itemQuery) {
    return null;
  }

  const value = (() => {
    if (itemQuery.isError) {
      return mdash;
    }
    if ((rollupFeature.type === 'arbitrum' || rollupFeature.type === 'optimistic') && itemQuery.id === 'total_operational_transactions' && itemQuery.data) {
      return Number(itemQuery.data).toLocaleString();
    }
  })();

  if (!value) {
    return null;
  }

  const label = (() => {
    if ((rollupFeature.type === 'arbitrum' || rollupFeature.type === 'optimistic') && itemQuery.id === 'total_operational_transactions') {
      return itemQuery.title;
    }
  })();

  return (
    <Tooltip
      content={ RPC_TOOLTIP_CONTENT_NO_VALUE }
      disabled={ !itemQuery.isError }
    >
      <HomeStatsWidget
        label={ label || 'Total operational transactions' }
        icon="transactions"
        value={ value }
        href={{ pathname: '/txs' as const }}
        isLoading={ itemQuery.isLoading }
        isFallback={ itemQuery.isError }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsTotalOperationalTxs);
