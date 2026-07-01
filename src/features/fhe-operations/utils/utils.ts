// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import type { BadgeProps } from 'src/toolkit/chakra/badge';

// Maps FHE operation types to Blockscout color palette
export function getTypeColor(type: schemas['FheOperation']['type']): BadgeProps['colorPalette'] {
  const colors: Record<schemas['FheOperation']['type'], BadgeProps['colorPalette']> = {
    comparison: 'purple',
    control: 'orange',
    arithmetic: 'blue',
    bitwise: 'teal',
    encryption: 'cyan',
    unary: 'yellow',
    random: 'pink',
  };
  return colors[type] || 'gray';
}
