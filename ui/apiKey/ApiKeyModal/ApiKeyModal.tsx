import React, { useCallback } from 'react';

import type { TApiKeyItem } from 'data/apiKey';

import ApiKeyForm from './ApiKeyForm';
import FormModal from '../../shared/FormModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: TApiKeyItem;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const title = data ? 'Edit API key' : 'New API key';
  const text = 'Add an application name to identify your API key. Click the button below to auto-generate the associated key.'

  const renderForm = useCallback(() => {
    return <ApiKeyForm data={ data }/>
  }, [ data ]);
  return (
    <FormModal<TApiKeyItem>
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
