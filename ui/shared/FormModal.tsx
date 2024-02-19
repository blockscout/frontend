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

import useIsMobile from 'lib/hooks/useIsMobile';
import FormSubmitAlert from 'ui/shared/FormSubmitAlert';

interface Props<TData> {
  isOpen: boolean;
  onClose: () => void;
  data?: TData;
  title: string;
  text?: string;
  renderForm: () => JSX.Element;
  isAlertVisible?: boolean;
  setAlertVisible?: (isAlertVisible: boolean) => void;
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
    setAlertVisible && setAlertVisible(false);
    onClose();
  }, [ onClose, setAlertVisible ]);

  const isMobile = useIsMobile();

  return (
    <Modal isOpen={ isOpen } onClose={ onModalClose } size={ isMobile ? 'full' : 'md' }>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500" textStyle="h3">{ title }</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          { (isAlertVisible || text) && (
            <Box marginBottom={{ base: 6, lg: 8 }}>
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
