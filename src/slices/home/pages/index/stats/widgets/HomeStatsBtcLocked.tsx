// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import { WEI } from 'src/shared/values/entity/utils';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { getStatsHomeDataItem, RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const HomeStatsBtcLocked = () => {
  const { coreApiQuery, statsApiQuery } = useStatsHome();
  const itemQuery = getStatsHomeDataItem('rootstock_locked_btc', coreApiQuery, statsApiQuery);

  if (!itemQuery || itemQuery.id !== 'rootstock_locked_btc') {
    return null;
  }

  const value = (() => {
    if (itemQuery.isError) {
      return mdash;
    }

    if (typeof itemQuery.data !== 'string') {
      return;
    }
    return `${ BigNumber(itemQuery.data ?? 0).div(WEI).dp(0).toFormat() } RBTC`;
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
        label="BTC Locked in 2WP"
        icon="coins/bitcoin"
        value={ value }
        isLoading={ itemQuery.isLoading }
        isFallback={ itemQuery.isError }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsBtcLocked);
