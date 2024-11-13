import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import FormSubmitAlert from 'ui/shared/FormSubmitAlert';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  renderContent: () => React.JSX.Element;
  mutationFn: () => Promise<unknown>;
  onSuccess: () => Promise<void>;
};

const DeleteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  renderContent,
  mutationFn,
  onSuccess,
}) => {
  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const onModalClose = useCallback(() => {
    setAlertVisible(false);
    onClose();
  }, [ onClose, setAlertVisible ]);

  const mutation = useMutation({
    mutationFn,
    onSuccess: async() => {
      onSuccess();
      onClose();
    },
    onError: () => {
      setAlertVisible(true);
    },
  });

  const onDeleteClick = useCallback(() => {
    setAlertVisible(false);
    mutation.mutate();
  }, [ setAlertVisible, mutation ]);

  const isMobile = useIsMobile();

  return (
    <Modal isOpen={ isOpen } onClose={ onModalClose } size={ isMobile ? 'full' : 'md' }>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500" textStyle="h3">{ title }</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          { isAlertVisible && <Box mb={ 4 }><FormSubmitAlert/></Box> }
          { renderContent() }
        </ModalBody>
        <ModalFooter>
          <Button
            size="lg"
            onClick={ onDeleteClick }
            isLoading={ mutation.isPending }
            // FIXME: chackra's button is disabled when isLoading
            isDisabled={ false }
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
