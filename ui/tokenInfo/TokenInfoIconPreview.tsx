import { Center } from '@chakra-ui/react';
import React from 'react';

interface Props {
  url: string | undefined;
  isInvalid: boolean;
  children: React.ReactElement;
}

const TokenInfoIconPreview = ({ url, isInvalid, children }: Props) => {
  const borderColor = { _light: 'gray.100', _dark: 'gray.700' };
  const borderColorFilled = { _light: 'gray.300', _dark: 'gray.600' };
  const borderColorActive = isInvalid ? 'error' : borderColorFilled;

  return (
    <Center
      boxSize="60px"
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
