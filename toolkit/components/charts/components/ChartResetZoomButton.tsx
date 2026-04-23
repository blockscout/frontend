import { Icon } from '@chakra-ui/react';

import RepeatIcon from 'icons/repeat.svg';

import type { IconButtonProps } from '../../../chakra/icon-button';
import { IconButton } from '../../../chakra/icon-button';
import { Tooltip } from '../../../chakra/tooltip';

export interface ChartResetZoomButtonProps extends IconButtonProps {
  range?: unknown;
}

export const ChartResetZoomButton = ({ range, ...props }: ChartResetZoomButtonProps) => {
  return (
    <Tooltip content="Reset zoom">
      <IconButton hidden={ !range } aria-label="Reset zoom" size="md" variant="icon_background" { ...props }>
        <Icon><RepeatIcon/></Icon>
      </IconButton>
    </Tooltip>
  );
};
