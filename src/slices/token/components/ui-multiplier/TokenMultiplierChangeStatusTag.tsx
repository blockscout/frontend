// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { UiMultiplierChangeStatus } from 'src/slices/token/utils/ui-multiplier';

import type { BadgeProps } from 'src/toolkit/chakra/badge';
import { Badge } from 'src/toolkit/chakra/badge';

interface Props {
  status: UiMultiplierChangeStatus;
  isLoading?: boolean;
}

const STATUS_LABELS: Record<UiMultiplierChangeStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

const STATUS_COLORS: Record<UiMultiplierChangeStatus, BadgeProps['colorPalette']> = {
  active: 'green',
  inactive: 'gray',
};

const TokenMultiplierChangeStatusTag = ({ status, isLoading }: Props) => {
  return (
    <Badge colorPalette={ STATUS_COLORS[status] } loading={ isLoading }>
      { STATUS_LABELS[status] }
    </Badge>
  );
};

export default React.memo(TokenMultiplierChangeStatusTag);
