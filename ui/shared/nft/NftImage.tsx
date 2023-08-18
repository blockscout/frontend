import { Image } from '@chakra-ui/react';
import React from 'react';

interface Props {
  url: string;
  onLoad: () => void;
  onError: () => void;
}

const NftImage = ({ url, onLoad, onError }: Props) => {
  return (
    <Image
      w="100%"
      h="100%"
      src={ url }
      alt="Token instance image"
      onError={ onError }
      onLoad={ onLoad }
    />
  );
};

export default NftImage;
