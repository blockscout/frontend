import { chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  src: string;
  onLoad: () => void;
  onError: () => void;
}

const NftVideo = ({ src, onLoad, onError }: Props) => {
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
    />
  );
};

export default chakra(NftVideo);
