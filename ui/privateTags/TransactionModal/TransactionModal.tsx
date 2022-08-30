import React, { useCallback, useState } from 'react';

import type { TransactionTag } from 'types/api/account';

import FormModal from 'ui/shared/FormModal';

import TransactionForm from './TransactionForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: TransactionTag;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const title = data ? 'Edit transaction tag' : 'New transaction tag';
  const text = !data ? 'Label any transaction with a private transaction tag (up to 35 chars) to customize your explorer experience.' : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const renderForm = useCallback(() => {
    return <TransactionForm data={ data } onClose={ onClose } setAlertVisible={ setAlertVisible }/>;
  }, [ data, onClose ]);
  return (
    <FormModal<TransactionTag>
      isOpen={ isOpen }
      onClose={ onClose }
      title={ title }
      text={ text }
      renderForm={ renderForm }
      isAlertVisible={ isAlertVisible }
      setAlertVisible={ setAlertVisible }
    />
  );
};

export default AddressModal;
