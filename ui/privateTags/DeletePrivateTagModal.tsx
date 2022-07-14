import React, { useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import DeleteModal from '../shared/DeleteModal'

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tag?: string;
}

const DeletePrivateTagModal: React.FC<Props> = ({ isOpen, onClose, tag }) => {
  const onDelete = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('delete', tag);
  }, [ tag ]);

  const renderText = useCallback(() => {
    return (
      <Text display="flex">Tag<Text fontWeight="600" whiteSpace="pre">{ ` "${ tag || 'address' }" ` }</Text>will be deleted</Text>
    )
  }, [ tag ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Removal of private tag"
      renderText={ renderText }
    />
  )
}

export default DeletePrivateTagModal;
