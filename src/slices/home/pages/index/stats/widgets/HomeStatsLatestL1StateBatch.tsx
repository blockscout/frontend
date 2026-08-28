// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const HomeStatsLatestL1StateBatch = () => {
  const statsQuery = useStatsHome();

  const value = (() => {
    if (statsQuery.isError) {
      return mdash;
    }
    if (statsQuery.data.last_output_root_size) {
      return Number(statsQuery.data.last_output_root_size).toLocaleString();
    }
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
        label={ `Latest ${ layerLabels.parent } state batch` }
        icon="txn_batches"
        value={ value }
        href={{ pathname: '/batches' as const }}
        isLoading={ statsQuery.isLoading }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsLatestL1StateBatch);
