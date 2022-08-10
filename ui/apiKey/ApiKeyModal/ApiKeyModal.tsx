import React, { useCallback } from 'react';

import type { ApiKey } from 'types/api/account';

import FormModal from 'ui/shared/FormModal';

import ApiKeyForm from './ApiKeyForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: ApiKey;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const title = data ? 'Edit API key' : 'New API key';
  const text = 'Add an application name to identify your API key. Click the button below to auto-generate the associated key.';

  const renderForm = useCallback(() => {
    return <ApiKeyForm data={ data } onClose={ onClose }/>;
  }, [ data, onClose ]);
  return (
    <FormModal<ApiKey>
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
