import { chakra } from '@chakra-ui/react';
import React from 'react';

import { mediaStyleProps } from './utils';

interface Props {
  src: string;
  onLoad: () => void;
  onError: () => void;
  onClick?: () => void;
}

const NftVideo = ({ src, onLoad, onError, onClick }: Props) => {
  return (
    <chakra.video
      src={ src }
      autoPlay
      disablePictureInPicture
      loop
      muted
      playsInline
      onCanPlayThrough={ onLoad }
      onError={ onError }
      borderRadius="md"
      onClick={ onClick }
      { ...mediaStyleProps }
    />
  );
};

export default chakra(NftVideo);
