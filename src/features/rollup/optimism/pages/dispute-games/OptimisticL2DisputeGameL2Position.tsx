// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BlockEntityL2 from 'src/features/rollup/common/components/BlockEntityL2';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

type Props = {
  item: Pick<schemas['OptimismGame'], 'l2_block_number' | 'l2_timestamp'>;
  isLoading?: boolean;
};

const OptimisticL2DisputeGameL2Position = ({ item, isLoading }: Props) => {
  if (item.l2_block_number !== null && item.l2_block_number !== undefined) {
    return (
      <BlockEntityL2
        isLoading={ isLoading }
        number={ item.l2_block_number }
        noIcon
      />
    );
  }

  return (
    <TimeWithTooltip
      timestamp={ item.l2_timestamp }
      fallbackText="N/A"
      isLoading={ isLoading }
      display="inline-block"
    />
  );
};

export default OptimisticL2DisputeGameL2Position;
