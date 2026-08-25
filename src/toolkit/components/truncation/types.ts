// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import type React from 'react';

import type { ExcludeUndefined } from 'src/shared/types/utils';

import type { TooltipProps } from '../../chakra/tooltip';

export interface TruncateTooltipConfig {
  // override the shown content (not the trigger — the tooltip still appears only when truncated)
  content?: React.ReactNode;
  interactive?: boolean;
  placement?: ExcludeUndefined<TooltipProps['positioning']>['placement'];
}

export interface TruncateBaseProps extends Omit<HTMLChakraProps<'span'>, 'children' | 'as'> {
  value: string;
  loading?: boolean;
  as?: React.ElementType;
  // omitted → tooltip only when truncated; object → override content/placement; false → suppress entirely
  tooltip?: false | TruncateTooltipConfig;
}
