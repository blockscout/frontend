import { Skeleton, Tooltip, chakra } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';

type Props = {
  label: string;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}

const PopoverTriggerTooltip = ({ label, isLoading, className, children }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const isMobile = useIsMobile();
  return (
    // tooltip need to be wrapped in div for proper popover positioning
    <Skeleton isLoaded={ !isLoading } borderRadius="base" ref={ ref } className={ className }>
      <Tooltip
        label={ label }
        isDisabled={ isMobile }
        // need a delay to avoid flickering when closing the popover
        openDelay={ 100 }
      >
        { children }
      </Tooltip>
    </Skeleton>
  );
};

export default chakra(React.forwardRef(PopoverTriggerTooltip));
