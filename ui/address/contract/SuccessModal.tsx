/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
} from '@chakra-ui/react';
import React from 'react';

type Props = {
  open: boolean;
  inscriptionId: string;
  setOpen: (val: boolean) => void;
};
const SuccessModal = ({ open, inscriptionId, setOpen }: Props) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Modal isOpen={ open } onClose={ handleClose }>
      <ModalContent>
        <ModalCloseButton/>
        <ModalBody fontWeight={ 700 } fontSize={ 20 }>Contract Inscribed successfully.</ModalBody>
        <ModalBody fontSize={ 16 }>
          { ' ' }
          Contract ID : { inscriptionId?.substring(0, 10) }...
          { inscriptionId?.substring(56, 66) }
        </ModalBody>
        <ModalFooter display="flex" justifyContent="end">
          <Button colorScheme="blue" onClick={ handleClose }>
            Ok
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SuccessModal;
