import { Icon } from '@chakra-ui/react';
import React from 'react';

import InfoIcon from 'icons/info.svg';

import type { IconButtonProps } from '../../chakra/icon-button';
import { IconButton } from '../../chakra/icon-button';
import type { TooltipProps } from '../../chakra/tooltip';
import { Tooltip } from '../../chakra/tooltip';

interface Props extends IconButtonProps {
  label: string | React.ReactNode;
  tooltipProps?: Partial<TooltipProps>;
  isLoading?: boolean;
  as?: React.ElementType;
}

export const Hint = React.memo(({ label, tooltipProps, isLoading, boxSize = 5, ...rest }: Props) => {
  return (
    <Tooltip
      content={ label }
      positioning={{ placement: 'top' }}
      { ...tooltipProps }
    >
      <IconButton
        aria-label="hint"
        boxSize={ boxSize }
        loadingSkeleton={ isLoading }
        borderRadius="sm"
        color="icon.info"
        _hover={{ color: 'link.primary.hover' }}
        { ...rest }
      >
        <Icon boxSize={ boxSize }>
          <InfoIcon/>
        </Icon>
      </IconButton>
    </Tooltip>
  );
});
