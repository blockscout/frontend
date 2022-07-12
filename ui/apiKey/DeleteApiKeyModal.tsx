import React, { useCallback } from 'react';

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
  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Remove API key"
      text={ `API key for  "${ name || 'name' }" will be deleted` }
    />
  )
}

export default DeleteAddressModal;
