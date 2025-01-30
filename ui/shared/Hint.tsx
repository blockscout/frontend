import { chakra } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import type { TooltipProps } from 'toolkit/chakra/tooltip';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  label: string | React.ReactNode;
  className?: string;
  tooltipProps?: Partial<TooltipProps>;
  isLoading?: boolean;
}

const Hint = ({ label, className, tooltipProps, isLoading }: Props) => {
  // TODO @tom2drum check and remove this
  // have to implement controlled tooltip because of the issue - https://github.com/chakra-ui/chakra-ui/issues/7107
  // const { open, onOpen, onToggle, onClose } = useDisclosure();

  // const handleClick = React.useCallback((event: React.MouseEvent) => {
  //   event.stopPropagation();
  //   onToggle();
  // }, [ onToggle ]);

  if (isLoading) {
    return <Skeleton className={ className } boxSize={ 5 } borderRadius="sm"/>;
  }

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
        // onMouseEnter={ onOpen }
        // onMouseLeave={ onClose }
        // onClick={ handleClick }
      >
        <IconSvg name="info" w="100%" h="100%" color="icon_info" _hover={{ color: 'link.primary.hover' }}/>
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(chakra(Hint));
