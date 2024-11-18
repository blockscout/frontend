import { IconButton, chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

type Props = {
  onClick: () => void;
  isActive: boolean;
  className?: string;
  isLoading?: boolean;
};

const ButtonMobile = ({ onClick, isActive, className, isLoading }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  if (isLoading) {
    return <Skeleton className={ className } w="36px" h="32px" borderRadius="base"/>;
  }

  return (
    <IconButton
      ref={ ref }
      icon={ <IconSvg name="arrows/up-down" boxSize={ 5 }/> }
      aria-label="sort"
      size="sm"
      variant="outline"
      colorScheme="gray"
      minWidth="36px"
      onClick={ onClick }
      isActive={ isActive }
      display="flex"
      className={ className }
    />
  );
};

export default chakra(React.forwardRef(ButtonMobile));
