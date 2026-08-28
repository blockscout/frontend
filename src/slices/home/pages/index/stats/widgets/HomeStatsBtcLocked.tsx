// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import { WEI } from 'src/shared/values/entity/utils';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const HomeStatsBtcLocked = () => {
  const statsQuery = useStatsHome();

  const value = (() => {
    if (statsQuery.isError) {
      return mdash;
    }

    if (typeof statsQuery?.data?.rootstock_locked_btc !== 'string') {
      return;
    }
    return `${ BigNumber(statsQuery?.data?.rootstock_locked_btc ?? 0).div(WEI).dp(0).toFormat() } RBTC`;
  })();

  if (!value) {
    return null;
  }

  return (
    <Tooltip
      content={ RPC_TOOLTIP_CONTENT_NO_VALUE }
      disabled={ !statsQuery.isError }
    >
      <HomeStatsWidget
        label="BTC Locked in 2WP"
        icon="coins/bitcoin"
        value={ value }
        isLoading={ statsQuery.isLoading }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsBtcLocked);
