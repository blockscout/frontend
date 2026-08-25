// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import type React from 'react';

import type { TooltipProps } from '../../chakra/tooltip';

export interface TruncateTooltipConfig extends Partial<TooltipProps> {
  // force the tooltip open even when the value is not truncated — for when `content` carries
  // actionable UI (e.g. a link) that would otherwise be unreachable on a wide viewport
  always?: boolean;
}

export interface TruncateBaseProps extends Omit<HTMLChakraProps<'span'>, 'children' | 'as'> {
  value: string;
  loading?: boolean;
  as?: React.ElementType;
  // omitted → tooltip only when truncated; object → override content/placement; false → suppress entirely
  tooltip?: false | TruncateTooltipConfig;
}
