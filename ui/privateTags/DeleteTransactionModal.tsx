import React, { useCallback } from 'react';

import DeleteModal from '../shared/DeleteModal'

type Props = {
  isOpen: boolean;
  onClose: () => void;
  transaction?: string;
}

const DeleteTransactionModal: React.FC<Props> = ({ isOpen, onClose, transaction }) => {
  const onDelete = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('delete', transaction);
  }, [ transaction ]);
  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Remove transaction private tag"
      text={ `Transaction ${ transaction || 'transaction' } will be deleted` }
    />
  )
}

export default DeleteTransactionModal;
