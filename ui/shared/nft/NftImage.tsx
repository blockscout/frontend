import { Image } from '@chakra-ui/react';
import React from 'react';

import { mediaStyleProps } from './utils';

interface Props {
  src: string;
  srcSet?: string;
  onLoad: () => void;
  onError: () => void;
  onClick?: () => void;
}

const NftImage = ({ src, srcSet, onLoad, onError, onClick }: Props) => {
  return (
    <Image
      w="100%"
      h="100%"
      src={ src }
      srcSet={ srcSet }
      alt="Token instance image"
      onError={ onError }
      onLoad={ onLoad }
      onClick={ onClick }
      { ...mediaStyleProps }
    />
  );
};

export default NftImage;
