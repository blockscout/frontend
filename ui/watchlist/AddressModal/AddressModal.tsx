import React, { useCallback, useState } from 'react';

import type { TWatchlistItem } from 'types/client/account';

import FormModal from 'ui/shared/FormModal';

import AddressForm from './AddressForm';

type Props = {
  isAdd: boolean;
  isOpen: boolean;
  onClose: () => void;
  data?: Partial<TWatchlistItem>;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, data, isAdd }) => {
  const title = !isAdd ? 'Edit watch list address' : 'New address to watch list';
  const text = isAdd ? 'An email notification can be sent to you when an address on your watch list sends or receives any transactions.' : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const renderForm = useCallback(() => {
    return <AddressForm data={ data } onClose={ onClose } setAlertVisible={ setAlertVisible } isAdd={ isAdd }/>;
  }, [ data, isAdd, onClose ]);

  return (
    <FormModal<TWatchlistItem>
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
