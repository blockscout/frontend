import React, { useCallback } from 'react';

import type { TWatchlistItem } from 'data/watchlist';

import AddressForm from './AddressForm';
import FormModal from '../../shared/FormModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: TWatchlistItem;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const title = data ? 'Edit watch list address' : 'New address to watch list';
  const text = 'An email notification can be sent to you when an address on your watch list sends or receives any transactions.'

  const renderForm = useCallback(() => {
    return <AddressForm data={ data }/>
  }, [ data ]);
  return (
    <FormModal<TWatchlistItem>
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
