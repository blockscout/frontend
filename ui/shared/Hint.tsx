import { chakra } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import type { TooltipProps } from 'toolkit/chakra/tooltip';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  label: string | React.ReactNode;
  className?: string;
  tooltipProps?: Partial<TooltipProps>;
  isLoading?: boolean;
  as?: React.ElementType;
}

const Hint = ({ label, className, tooltipProps, isLoading, as }: Props) => {
  return (
    <Tooltip
      content={ label }
      positioning={{ placement: 'top' }}
      interactive
      { ...tooltipProps }
    >
      <IconButton
        aria-label="hint"
        boxSize={ 5 }
        className={ className }
        loadingSkeleton={ isLoading }
        borderRadius="sm"
        as={ as }
      >
        <IconSvg name="info" w="100%" h="100%" color="icon_info" _hover={{ color: 'link.primary.hover' }}/>
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(chakra(Hint));
