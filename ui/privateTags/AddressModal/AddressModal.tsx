import React, { useCallback, useState } from 'react';

import type { AddressTag } from 'types/api/account';

import FormModal from 'ui/shared/FormModal';

import AddressForm from './AddressForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: AddressTag;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const title = data ? 'Edit address tag' : 'New address tag';
  const text = !data ? 'Label any address with a private address tag (up to 35 chars) to customize your explorer experience.' : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const renderForm = useCallback(() => {
    return <AddressForm data={ data } onClose={ onClose } setAlertVisible={ setAlertVisible }/>;
  }, [ data, onClose ]);
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
