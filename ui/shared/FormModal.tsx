import React from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';

interface Props<TData> {
  isOpen: boolean;
  onClose: () => void;
  data?: TData;
  title: string;
  text: string;
  renderForm: () => JSX.Element;
}

export default function FormModal<TData>({ isOpen, onClose, data, title, text, renderForm }: Props<TData>) {
  return (
    <Modal isOpen={ isOpen } onClose={ onClose } size="md">
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500" textStyle="h3">{ title }</ModalHeader>
        <ModalCloseButton/>
        <ModalBody mb={ 0 }>
          { !data && (
            <Text lineHeight="30px" marginBottom={ 12 }>
              { text }
            </Text>
          ) }
          { renderForm() }
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
