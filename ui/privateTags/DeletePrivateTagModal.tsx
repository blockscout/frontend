import React, { useCallback } from 'react';

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
  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Removal of private tag"
      text={ `Tag "${ tag || 'address' }" will be removed` }
    />
  )
}

export default DeletePrivateTagModal;
