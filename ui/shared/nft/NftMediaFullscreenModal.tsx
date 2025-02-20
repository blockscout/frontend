import React from 'react';

import { DialogContent, DialogRoot, DialogHeader } from 'toolkit/chakra/dialog';

interface Props {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  children: React.ReactNode;
}

const NftMediaFullscreenModal = ({ open, onOpenChange, children }: Props) => {
  return (
    <DialogRoot open={ open } onOpenChange={ onOpenChange } motionPreset="none">
      <DialogContent w="unset" maxW="100vw" p={ 0 } background="none" boxShadow="none">
        <DialogHeader/>
        { children }
      </DialogContent>
    </DialogRoot>
  );
};

export default NftMediaFullscreenModal;
