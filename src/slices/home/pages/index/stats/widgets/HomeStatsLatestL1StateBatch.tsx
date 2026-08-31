// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { getStatsHomeDataItem, RPC_TOOLTIP_CONTENT_NO_VALUE } from '../utils';

const HomeStatsLatestL1StateBatch = () => {
  const { coreApiQuery, statsApiQuery } = useStatsHome();
  const itemQuery = getStatsHomeDataItem('last_output_root_size', coreApiQuery, statsApiQuery);

  if (!itemQuery || itemQuery.id !== 'last_output_root_size') {
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
        label={ `Latest ${ layerLabels.parent } state batch` }
        icon="txn_batches"
        value={ value }
        href={{ pathname: '/batches' as const }}
        isLoading={ itemQuery.isLoading }
        isFallback={ itemQuery.isError }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsLatestL1StateBatch);
