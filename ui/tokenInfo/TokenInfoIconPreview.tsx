import { Center, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  url: string | undefined;
  isInvalid: boolean;
  children: React.ReactElement;
}

const TokenInfoIconPreview = ({ url, isInvalid, children }: Props) => {
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const borderColorFilled = useColorModeValue('gray.300', 'gray.600');
  const borderColorActive = isInvalid ? 'error' : borderColorFilled;

  return (
    <Center
      boxSize={{ base: '60px', lg: '80px' }}
      flexShrink={ 0 }
      borderWidth="2px"
      borderColor={ url ? borderColorActive : borderColor }
      borderRadius="base"
    >
      { children }
    </Center>
  );
};

export default React.memo(TokenInfoIconPreview);
