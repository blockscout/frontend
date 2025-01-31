import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  isOpen: boolean;
}

const SearchBarBackdrop = ({ isOpen }: Props) => {
  const backdropBgColor = useColorModeValue('blackAlpha.400', 'blackAlpha.600');

  return (
    <Box
      position="fixed"
      top={ 0 }
      left={ 0 }
      w="100vw"
      h="100vh"
      bgColor={ backdropBgColor }
      zIndex="overlay"
      display={{ base: 'none', lg: isOpen ? 'block' : 'none' }}
    />
  );
};

export default React.memo(SearchBarBackdrop);
