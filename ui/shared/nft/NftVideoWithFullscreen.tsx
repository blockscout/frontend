import {
  chakra,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import NftMediaFullscreenModal from './NftMediaFullscreenModal';
import NftVideo from './NftVideo';

interface Props {
  src: string;
  onLoad: () => void;
  onError: () => void;
}

const NftVideoWithFullscreen = ({ src, onLoad, onError }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <NftVideo src={ src } onLoad={ onLoad } onError={ onError } onClick={ onOpen }/>
      <NftMediaFullscreenModal isOpen={ isOpen } onClose={ onClose }>
        <chakra.video
          src={ src }
          autoPlay
          disablePictureInPicture
          loop
          muted
          playsInline
          onCanPlayThrough={ onLoad }
          onError={ onError }
          maxH="90vh"
          maxW="90vw"
        />
      </NftMediaFullscreenModal>
    </>
  );
};

export default NftVideoWithFullscreen;
