import { Center, Image, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import TokenLogoPlaceholder from 'ui/shared/TokenLogoPlaceholder';

interface Props {
  url: string | undefined;
  onLoad?: () => void;
  onError?: () => void;
  isInvalid: boolean;
}

const TokenInfoIconPreview = ({ url, onError, onLoad, isInvalid }: Props) => {
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const borderColorFilled = useColorModeValue('gray.300', 'gray.600');
  const borderColorError = useColorModeValue('red.400', 'red.300');
  const borderColorActive = isInvalid ? borderColorError : borderColorFilled;

  return (
    <Center
      boxSize={{ base: '60px', lg: '80px' }}
      flexShrink={ 0 }
      borderWidth="2px"
      borderColor={ url ? borderColorActive : borderColor }
      borderRadius="base"
    >
      <Image
        borderRadius="base"
        src={ url }
        alt="Token logo preview"
        boxSize={{ base: 10, lg: 12 }}
        objectFit="cover"
        fallback={ url && !isInvalid ? <Skeleton boxSize={{ base: 10, lg: 12 }}/> : <TokenLogoPlaceholder boxSize={{ base: 10, lg: 12 }}/> }
        onError={ onError }
        onLoad={ onLoad }
      />
    </Center>
  );
};

export default React.memo(TokenInfoIconPreview);
