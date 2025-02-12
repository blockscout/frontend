import {
  Box,
  useColorModeValue,
  Button,
  Skeleton,
  chakra,
} from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

type ButtonProps = {
  isActive: boolean;
  onClick: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
};

const ButtonDesktop = ({ children, isActive, onClick, isLoading, className }: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const primaryColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  const secondaryColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');

  return (
    <Skeleton isLoaded={ !isLoading }>
      <Button
        className={ className }
        ref={ ref }
        size="sm"
        variant="outline"
        onClick={ onClick }
        color={ primaryColor }
        fontWeight="600"
        borderColor="transparent"
        px={ 2 }
        data-selected={ isActive }
      >
        <Box
          as={ isActive ? 'div' : 'span' }
          color={ isActive ? 'inherit' : secondaryColor }
          fontWeight="400"
          mr={ 1 }
          transition={ isActive ? 'none' : 'inherit' }
        >Sort by</Box>
        { children }
        <IconSvg
          name="arrows/east-mini"
          boxSize={ 5 }
          ml={ 1 }
          transform={ isActive ? 'rotate(90deg)' : 'rotate(-90deg)' }
        />
      </Button>
    </Skeleton>
  );
};

export default chakra(React.forwardRef(ButtonDesktop));
