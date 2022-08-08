import React, { useCallback } from 'react';

import type { AddressTag } from 'types/api/account';

import AddressForm from './AddressForm';
import FormModal from 'ui/shared/FormModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: AddressTag;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const title = data ? 'Edit address tag' : 'New address tag';
  const text = 'Label any address with a private address tag (up to 35 chars) to customize your explorer experience.';

  const renderForm = useCallback(() => {
    return <AddressForm data={ data } onClose={ onClose }/>;
  }, [ data, onClose ]);
  return (
    <FormModal<AddressTag>
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
