import React, { useCallback } from 'react';

import type { TPrivateTagsTransactionItem } from 'data/privateTagsTransaction';

import TransactionForm from './TransactionForm';
import FormModal from '../../shared/FormModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: TPrivateTagsTransactionItem;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const title = data ? 'Edit transaction tag' : 'New transaction tag';
  const text = 'Label any transaction with a private transaction tag (up to 35 chars) to customize your explorer experience.'

  const renderForm = useCallback(() => {
    return <TransactionForm data={ data }/>
  }, [ data ]);
  return (
    <FormModal<TPrivateTagsTransactionItem>
      isOpen={ isOpen }
      onClose={ onClose }
      title={ title }
      text={ text }
      data={ data }
      renderForm={ renderForm }
    />
  )
}

export default AddressModal;
