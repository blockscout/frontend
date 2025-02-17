import React from 'react';

import { Image } from 'toolkit/chakra/image';

import NftMediaFullscreenModal from './NftMediaFullscreenModal';

interface Props {
  src: string;
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
}

const NftImageFullscreen = ({ src, open, onOpenChange }: Props) => {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [ hasDimensions, setHasDimensions ] = React.useState<boolean>(true);

  const checkWidth = React.useCallback(() => {
    if (imgRef.current?.getBoundingClientRect().width === 0) {
      setHasDimensions(false);
    }
  }, [ ]);

  return (
    <NftMediaFullscreenModal open={ open } onOpenChange={ onOpenChange }>
      <Image
        src={ src }
        alt="Token instance image"
        maxH="90vh"
        maxW="90vw"
        ref={ imgRef }
        onLoad={ checkWidth }
        { ...(hasDimensions ? {} : { width: '90vw', height: '90vh' }) }
      />
    </NftMediaFullscreenModal>
  );
};

export default NftImageFullscreen;
