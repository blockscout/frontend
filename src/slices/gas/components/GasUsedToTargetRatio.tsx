// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

type Props = {
  value: number;
  isLoading?: boolean;
};

const GasUsedToTargetRatio = ({ value, isLoading }: Props) => {
  return (
    <Tooltip content="% of Gas Target">
      <Skeleton color="text.secondary" loading={ isLoading }>
        <span>{ (value > 0 ? '+' : '') + value.toLocaleString(undefined, { maximumFractionDigits: 2 }) }%</span>
      </Skeleton>
    </Tooltip>
  );
};

export default React.memo(GasUsedToTargetRatio);
