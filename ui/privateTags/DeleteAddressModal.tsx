import React, { useCallback } from 'react';

import DeleteModal from '../shared/DeleteModal'

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
  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Remove address private tag"
      text={ `Address ${ address || 'address' } will be deleted` }
    />
  )
}

export default DeleteAddressModal;
