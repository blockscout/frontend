import React, { useCallback, useState } from 'react';

import type { CustomAbi } from 'types/api/account';

import FormModal from 'ui/shared/FormModal';

import CustomAbiForm from './CustomAbiForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: CustomAbi;
}

const CustomAbiModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const title = data ? 'Edit custom ABI' : 'New custom ABI';
  const text = !data ? 'Double check the ABI matches the contract to prevent errors or incorrect results.' : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  const renderForm = useCallback(() => {
    return <CustomAbiForm data={ data } onClose={ onClose } setAlertVisible={ setAlertVisible }/>;
  }, [ data, onClose ]);
  return (
    <FormModal<CustomAbi>
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

export default React.memo(CustomAbiModal);
