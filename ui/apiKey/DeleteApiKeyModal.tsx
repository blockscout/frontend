import React, { useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import DeleteModal from '../shared/DeleteModal'

type Props = {
  isOpen: boolean;
  onClose: () => void;
  name?: string;
}

const DeleteAddressModal: React.FC<Props> = ({ isOpen, onClose, name }) => {
  const onDelete = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('delete', name);
  }, [ name ]);

  const renderText = useCallback(() => {
    return (
      <Text display="flex">API key for<Text fontWeight="600" whiteSpace="pre">{ ` "${ name || 'name' }" ` }</Text>will be deleted</Text>
    )
  }, [ name ]);
  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Remove API key"
      renderText={ renderText }
    />
  )
}

export default DeleteAddressModal;
