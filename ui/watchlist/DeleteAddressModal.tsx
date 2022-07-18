import React, { useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import DeleteModal from 'ui/shared/DeleteModal'

type Props = {
  isOpen: boolean;
  onClose: () => void;
  address?: string;
}

const DeleteAddressModal: React.FC<Props> = ({ isOpen, onClose, address }) => {
  const onDelete = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('delete', address);
  }, [ address ]);

  const renderText = useCallback(() => {
    return (
      <Text display="flex">Address <Text fontWeight="600" whiteSpace="pre"> { address || 'address' } </Text>   will be deleted</Text>
    )
  }, [ address ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Remove address from watch list"
      renderText={ renderText }
    />
  )
}

export default DeleteAddressModal;
