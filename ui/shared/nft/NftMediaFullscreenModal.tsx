import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const NftMediaFullscreenModal = ({ isOpen, onClose, children }: Props) => {
  return (
    <Modal isOpen={ isOpen } onClose={ onClose } motionPreset="none">
      <ModalOverlay/>
      <ModalContent w="unset" maxW="100vw" p={ 0 }>
        <ModalCloseButton position="fixed" color="whiteAlpha.800"/>
        { children }
      </ModalContent>
    </Modal>
  );
};

export default NftMediaFullscreenModal;
