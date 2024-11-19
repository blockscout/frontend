import React, { useCallback, useState } from 'react';

import type { AddressTag } from 'types/api/account';

import * as mixpanel from 'lib/mixpanel/index';
import FormModal from 'ui/shared/FormModal';

import AddressForm from './AddressForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  data?: Partial<AddressTag>;
  pageType: string;
};

const AddressModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, data, pageType }) => {
  const title = data?.id ? 'Edit address tag' : 'New address tag';
  const text = !data?.id ? 'Label any address with a private address tag (up to 35 chars) to customize your explorer experience.' : '';

  const [ isAlertVisible, setAlertVisible ] = useState(false);

  React.useEffect(() => {
    isOpen && !data?.id && mixpanel.logEvent(
      mixpanel.EventTypes.PRIVATE_TAG,
      { Action: 'Form opened', 'Page type': pageType, 'Tag type': 'Address' },
    );
  }, [ data?.id, isOpen, pageType ]);

  const handleSuccess = React.useCallback(() => {
    if (!data?.id) {
      mixpanel.logEvent(
        mixpanel.EventTypes.PRIVATE_TAG,
        { Action: 'Submit', 'Page type': pageType, 'Tag type': 'Address' },
      );
    }
    return onSuccess();
  }, [ data?.id, onSuccess, pageType ]);

  const renderForm = useCallback(() => {
    return <AddressForm data={ data } onClose={ onClose } onSuccess={ handleSuccess } setAlertVisible={ setAlertVisible }/>;
  }, [ data, onClose, handleSuccess ]);
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
