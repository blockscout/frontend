import React, { useCallback } from 'react';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  getDisclosureProps: () => any;
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
        <ModalCloseButton/>
        <ModalBody>
          { `Delete ${ address || 'address' } from watchlist?` }
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={ onDeleteClick }>Yes</Button>
          <Button variant="primary" ml={ 3 } onClick={ onClose }>
              No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteModal;
