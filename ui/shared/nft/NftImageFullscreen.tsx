import {
  Image,
} from '@chakra-ui/react';
import React from 'react';

import NftMediaFullscreenModal from './NftMediaFullscreenModal';

interface Props {
  src: string;
  isOpen: boolean;
  onClose: () => void;
}

const NftImageWithFullscreen = ({ src, isOpen, onClose }: Props) => {
  return (
    <NftMediaFullscreenModal isOpen={ isOpen } onClose={ onClose }>
      <Image src={ src } alt="Token instance image" maxH="90vh" maxW="90vw"/>
    </NftMediaFullscreenModal>
  );
};

export default NftImageWithFullscreen;
