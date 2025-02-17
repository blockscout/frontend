import { chakra } from '@chakra-ui/react';
import React from 'react';

import NftMediaFullscreenModal from './NftMediaFullscreenModal';

interface Props {
  src: string;
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
}

const NftHtmlFullscreen = ({ src, open, onOpenChange }: Props) => {
  return (
    <NftMediaFullscreenModal open={ open } onOpenChange={ onOpenChange }>
      <chakra.iframe
        w="90vw"
        h="90vh"
        src={ src }
        sandbox="allow-scripts"
      />
    </NftMediaFullscreenModal>
  );
};

export default NftHtmlFullscreen;
