import React, { useCallback, useState } from 'react';

import type { ApiKey } from 'types/api/account';

import FormModal from 'ui/shared/FormModal';

import ApiKeyForm from './ApiKeyForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: ApiKey;
};

const ApiKeyModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const title = data ? 'Edit API key' : 'New API key';
  const text = !data ? 'Add an application name to identify your API key. Click the button below to auto-generate the associated key.' : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const renderForm = useCallback(() => {
    return <ApiKeyForm data={ data } onClose={ onClose } setAlertVisible={ setAlertVisible }/>;
  }, [ data, onClose ]);
  return (
    <FormModal<ApiKey>
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

export default ApiKeyModal;
