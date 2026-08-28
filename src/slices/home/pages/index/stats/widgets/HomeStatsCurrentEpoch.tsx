// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const HomeStatsCurrentEpoch = () => {
  const statsQuery = useStatsHome();

  const value = (() => {
    if (statsQuery.isError) {
      return mdash;
    }
    if (typeof statsQuery?.data?.celo_epoch_number !== 'number') {
      return;
    }
    return `#${ statsQuery.data.celo_epoch_number }`;
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
        label="Current epoch"
        icon="hourglass"
        value={ value }
        href={{ pathname: '/epochs/[number]' as const, query: { number: String(statsQuery.data.celo_epoch_number) } }}
        isLoading={ statsQuery.isLoading }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsCurrentEpoch);
