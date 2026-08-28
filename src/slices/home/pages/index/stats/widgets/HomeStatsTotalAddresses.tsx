// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const HomeStatsTotalAddresses = () => {
  const statsQuery = useStatsHome();

  const value = (() => {
    if (statsQuery.isError) {
      return mdash;
    }
    return Number(statsQuery.data?.total_addresses).toLocaleString();
  })();

  return (
    <Tooltip
      content={ RPC_TOOLTIP_CONTENT_NO_VALUE }
      disabled={ !statsQuery.isError }
    >
      <HomeStatsWidget
        label={ statsQuery.labels?.total_addresses || 'Wallet addresses' }
        icon="wallet"
        value={ value }
        isLoading={ statsQuery.isLoading }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsTotalAddresses);
