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
  onDelete: () => void;
  title: string;
  renderText: () => JSX.Element;
}

const DeleteModal: React.FC<Props> = ({ isOpen, onClose, onDelete, title, renderText }) => {

  const onDeleteClick = useCallback(() => {
    onDelete();
    onClose()
  }, [ onClose, onDelete ]);

  return (
    <Modal isOpen={ isOpen } onClose={ onClose } size="md">
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500" textStyle="h3">{ title }</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          { renderText() }
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
