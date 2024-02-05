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

const NftImageFullscreen = ({ src, isOpen, onClose }: Props) => {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [ hasDimentions, setHasDimentions ] = React.useState<boolean>(true);

  const checkWidth = React.useCallback(() => {
    if (imgRef.current?.getBoundingClientRect().width === 0) {
      setHasDimentions(false);
    }
  }, [ ]);

  return (
    <NftMediaFullscreenModal isOpen={ isOpen } onClose={ onClose }>
      <Image
        src={ src }
        alt="Token instance image"
        maxH="90vh"
        maxW="90vw"
        ref={ imgRef }
        onLoad={ checkWidth }
        sx={ hasDimentions ? {} : { width: '90vw', height: '90vh' } }
      />
    </NftMediaFullscreenModal>
  );
};

export default NftImageFullscreen;
