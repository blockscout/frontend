import { chakra } from '@chakra-ui/react';
import React from 'react';

import NftMediaFullscreenModal from './NftMediaFullscreenModal';

interface Props {
  src: string;
  isOpen: boolean;
  onClose: () => void;
}

const NftHtmlWithFullscreen = ({ src, isOpen, onClose }: Props) => {
  return (
    <NftMediaFullscreenModal isOpen={ isOpen } onClose={ onClose }>
      <chakra.iframe
        w="90vw"
        h="90vh"
        src={ src }
        sandbox="allow-scripts"
      />
    </NftMediaFullscreenModal>
  );
};

export default NftHtmlWithFullscreen;
