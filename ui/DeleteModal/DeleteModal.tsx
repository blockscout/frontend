import React, { useCallback } from 'react';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  address?: string;
}

const DeleteModal: React.FC<Props> = ({ isOpen, onClose, address }) => {

  const onDeleteClick = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('delete ', address);
    onClose()
  }, [ address, onClose ]);

  return (
    <Modal isOpen={ isOpen } onClose={ onClose } size="md">
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500" textStyle="h3">Remove address from watch list</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          { `Address ${ address || 'address' } will be deleted` }
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" size="lg" onClick={ onDeleteClick }>
              Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteModal;
