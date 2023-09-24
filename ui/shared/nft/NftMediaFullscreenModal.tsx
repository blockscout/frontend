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
      <ModalContent w="unset" maxW="100vw" p={ 0 } background="none" boxShadow="none">
        <ModalCloseButton position="fixed" top={{ base: 2.5, lg: 8 }} right={{ base: 2.5, lg: 8 }} color="whiteAlpha.800"/>
        { children }
      </ModalContent>
    </Modal>
  );
};

export default NftMediaFullscreenModal;
