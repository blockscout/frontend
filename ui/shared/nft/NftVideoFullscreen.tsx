import { chakra } from '@chakra-ui/react';
import React from 'react';

import NftMediaFullscreenModal from './NftMediaFullscreenModal';
import { videoPlayProps } from './utils';

interface Props {
  src: string;
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
}

const NftVideoFullscreen = ({ src, open, onOpenChange }: Props) => {
  return (
    <NftMediaFullscreenModal open={ open } onOpenChange={ onOpenChange }>
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
