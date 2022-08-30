import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import FormSubmitAlert from 'ui/shared/FormSubmitAlert';

interface Props<TData> {
  isOpen: boolean;
  onClose: () => void;
  data?: TData;
  title: string;
  text: string;
  renderForm: () => JSX.Element;
  isAlertVisible: boolean;
  setAlertVisible: (isAlertVisible: boolean) => void;
}

export default function FormModal<TData>({
  isOpen,
  onClose,
  title,
  text,
  renderForm,
  isAlertVisible,
  setAlertVisible,
}: Props<TData>) {

  const onModalClose = useCallback(() => {
    setAlertVisible(false);
    onClose();
  }, [ onClose, setAlertVisible ]);

  return (
    <Modal isOpen={ isOpen } onClose={ onModalClose } size={{ base: 'full', lg: 'md' }} >
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500" textStyle="h3">{ title }</ModalHeader>
        <ModalCloseButton/>
        <ModalBody mb={ 0 }>
          { (isAlertVisible || text) && (
            <Box marginBottom={{ base: 6, lg: 12 }}>
              { text && (
                <Text lineHeight="30px" mb={ 3 }>
                  { text }
                </Text>
              ) }
              { isAlertVisible && <FormSubmitAlert/> }
            </Box>
          ) }
          { renderForm() }
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
