import React, { useCallback, useState } from 'react';

import type { AddressTag } from 'types/api/account';

import FormModal from 'ui/shared/FormModal';

import AddressForm from './AddressForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  data?: Partial<AddressTag>;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, data }) => {
  const title = data?.id ? 'Edit address tag' : 'New address tag';
  const text = !data?.id ? 'Label any address with a private address tag (up to 35 chars) to customize your explorer experience.' : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const renderForm = useCallback(() => {
    return <AddressForm data={ data } onClose={ onClose } onSuccess={ onSuccess } setAlertVisible={ setAlertVisible }/>;
  }, [ data, onClose, onSuccess ]);
  return (
    <FormModal<AddressTag>
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
