import {
  Box,
  useColorModeValue,
  Button,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import IconSvg from 'ui/shared/IconSvg';
import SortButtonMobile from 'ui/shared/sort/SortButton';

type ButtonProps = {
  isMenuOpen: boolean;
  onClick: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
};

const SortButton = ({ children, isMenuOpen, onClick, isLoading }: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const isMobile = useIsMobile();

  const primaryColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  const secondaryColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');

  return (
    <Skeleton isLoaded={ !isLoading }>
      { isMobile ? (
        <SortButtonMobile ref={ ref } isActive={ isMenuOpen } onClick={ onClick }/>
      ) : (
        <Button
          ref={ ref }
          size="sm"
          variant="outline"
          onClick={ onClick }
          color={ primaryColor }
          fontWeight="600"
          borderColor="transparent"
          px={ 2 }
          data-selected={ isMenuOpen }
        >
          <Box
            as={ isMenuOpen ? 'div' : 'span' }
            color={ isMenuOpen ? 'inherit' : secondaryColor }
            fontWeight="400"
            mr={ 1 }
            transition={ isMenuOpen ? 'none' : 'inherit' }
          >Sort by</Box>
          { children }
          <IconSvg
            name="arrows/east-mini"
            boxSize={ 5 }
            ml={ 1 }
            transform={ isMenuOpen ? 'rotate(90deg)' : 'rotate(-90deg)' }
          />
        </Button>
      ) }
    </Skeleton>
  );
};

export default React.forwardRef(SortButton);
