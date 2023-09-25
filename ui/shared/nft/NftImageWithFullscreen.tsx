import {
  Image,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import NftImage from './NftImage';
import NftMediaFullscreenModal from './NftMediaFullscreenModal';

interface Props {
  src: string;
  onLoad: () => void;
  onError: () => void;
}

const NftImageWithFullscreen = ({ src, onLoad, onError }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <NftImage src={ src } onLoad={ onLoad } onError={ onError } onClick={ onOpen }/>
      <NftMediaFullscreenModal isOpen={ isOpen } onClose={ onClose }>
        <Image src={ src } alt="Token instance image" maxH="90vh" maxW="90vw"/>
      </NftMediaFullscreenModal>
    </>
  );
};

export default NftImageWithFullscreen;
