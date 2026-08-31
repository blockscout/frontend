// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { getStatsHomeDataItem, RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const HomeStatsCurrentEpoch = () => {
  const { coreApiQuery, statsApiQuery } = useStatsHome();
  const itemQuery = getStatsHomeDataItem('celo_epoch_number', coreApiQuery, statsApiQuery);

  if (!itemQuery || itemQuery.id !== 'celo_epoch_number') {
    return null;
  }

  const value = (() => {
    if (itemQuery.isError) {
      return mdash;
    }
    if (typeof itemQuery.data !== 'number') {
      return;
    }
    return `#${ itemQuery.data }`;
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
        label="Current epoch"
        icon="hourglass"
        value={ value }
        href={{ pathname: '/epochs/[number]' as const, query: { number: String(itemQuery.data ?? 0) } }}
        isLoading={ itemQuery.isLoading }
        isFallback={ itemQuery.isError }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsCurrentEpoch);
