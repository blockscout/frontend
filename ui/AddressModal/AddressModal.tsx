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

import type { TWatchlistItem } from '../../data/watchlist';

import AddressForm from './AddressForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: TWatchlistItem;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const title = data ? 'Edit watch list address' : 'New address to watch list';

  return (
    <Modal isOpen={ isOpen } onClose={ onClose } size="md">
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500" textStyle="h3">{ title }</ModalHeader>
        <ModalCloseButton/>
        <ModalBody mb={ 0 }>
          { !data && (
            <Text lineHeight="30px" marginBottom={ 12 }>
              An email notification can be sent to you when an address on your watch list sends or receives any transactions.
            </Text>
          ) }
          <AddressForm data={ data }/>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AddressModal;
