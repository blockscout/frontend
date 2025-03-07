import { chakra } from '@chakra-ui/react';
import React from 'react';

import NftMediaFullscreenModal from './NftMediaFullscreenModal';
import { videoPlayProps } from './utils';

interface Props {
  src: string;
  isOpen: boolean;
  onClose: () => void;
}

const NftVideoFullscreen = ({ src, isOpen, onClose }: Props) => {
  return (
    <NftMediaFullscreenModal isOpen={ isOpen } onClose={ onClose }>
      <chakra.video
        { ...videoPlayProps }
        src={ src }
        maxH="90vh"
        maxW="90vw"
        autoPlay={ true }
      />
    </NftMediaFullscreenModal>
  );
};

export default NftVideoFullscreen;
