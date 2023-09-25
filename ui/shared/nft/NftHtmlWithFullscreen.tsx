import { chakra, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import NftHtml from './NftHtml';
import NftMediaFullscreenModal from './NftMediaFullscreenModal';

interface Props {
  src: string;
  onLoad: () => void;
  onError: () => void;
}

const NftHtmlWithFullscreen = ({ src, onLoad, onError }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <NftHtml src={ src } onLoad={ onLoad } onError={ onError } onClick={ onOpen }/>
      <NftMediaFullscreenModal isOpen={ isOpen } onClose={ onClose }>
        <chakra.iframe
          w="90vw"
          h="90vh"
          src={ src }
          sandbox="allow-scripts"
          onLoad={ onLoad }
          onError={ onError }
        />
      </NftMediaFullscreenModal>
    </>
  );
};

export default NftHtmlWithFullscreen;
