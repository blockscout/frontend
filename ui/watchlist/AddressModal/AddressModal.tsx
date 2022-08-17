import React, { useCallback } from 'react';

import type { TWatchlistItem } from 'types/client/account';

import FormModal from 'ui/shared/FormModal';

import AddressForm from './AddressForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: TWatchlistItem;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const title = data ? 'Edit watch list address' : 'New address to watch list';
  const text = 'An email notification can be sent to you when an address on your watch list sends or receives any transactions.';

  const renderForm = useCallback(() => {
    return <AddressForm data={ data } onClose={ onClose }/>;
  }, [ data, onClose ]);
  return (
    <FormModal<TWatchlistItem>
      isOpen={ isOpen }
      onClose={ onClose }
      title={ title }
      text={ text }
      data={ data }
      renderForm={ renderForm }
    />
  );
};

export default AddressModal;
