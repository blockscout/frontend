import { Box, Button } from '@chakra-ui/react';
import React from 'react';

import Skeleton from 'ui/shared/chakra/Skeleton';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
  onClick: () => void;
  isOpen: boolean;
  isLoading?: boolean;
  label: string;
}

const SelectButton = ({ className, onClick, isOpen, isLoading, label }: Props, ref: React.Ref<HTMLButtonElement>) => {

  if (isLoading) {
    return <Skeleton className={ className } h={ 8 } borderRadius="base" flexShrink={ 0 }/>;
  }

  return (
    <Button
      ref={ ref }
      className={ className }
      variant="outline"
      size="sm"
      colorScheme="gray"
      fontWeight="500"
      lineHeight={ 5 }
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      columnGap={ 1 }
      onClick={ onClick }
      isActive={ isOpen }
      pl={ 2 }
      pr={ 1 }
      py={ 1 }
      flexShrink={ 0 }
    >
      <Box maxW="calc(100% - 20px)" overflow="hidden" textOverflow="ellipsis">{ label }</Box>
      <IconSvg name="arrows/east-mini" boxSize={ 5 } transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } flexShrink={ 0 }/>
    </Button>
  );
};

export default React.forwardRef(SelectButton);
