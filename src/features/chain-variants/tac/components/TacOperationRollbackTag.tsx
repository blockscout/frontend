// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { BadgeProps } from 'src/toolkit/chakra/badge';
import { Badge } from 'src/toolkit/chakra/badge';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import { ROLLBACK_TOOLTIP } from '../utils/tac-operation';

const TacOperationRollbackTag = (props: BadgeProps) => {
  return (
    <Tooltip content={ ROLLBACK_TOOLTIP }>
      <Badge colorPalette="gray" { ...props }>Rollback</Badge>
    </Tooltip>
  );
};

export default React.memo(TacOperationRollbackTag);
