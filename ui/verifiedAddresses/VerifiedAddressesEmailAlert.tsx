import React from 'react';

import config from 'configs/app';
import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import AuthModal from 'ui/snippets/auth/AuthModal';
import useLinkEmailDynamic from 'ui/snippets/auth/useLinkEmailDynamic';

const feature = config.features.account;

const VerifiedAddressesEmailAlert = () => {
  const authModal = useDisclosure();
  const linkEmailDynamic = useLinkEmailDynamic();

  const handleButtonClick = React.useCallback(() => {
    if (feature.isEnabled && feature.authProvider === 'dynamic') {
      linkEmailDynamic();
    } else {
      authModal.onOpen();
    }
  }, [ authModal, linkEmailDynamic ]);

  return (
    <>
      <Alert
        status="warning"
        mb={ 6 }
        descriptionProps={{
          alignItems: 'center',
          gap: 2,
        }}
      >
        You need a valid email address to verify contracts. Please add your email to your account.
        <Button variant="outline" size="sm" onClick={ handleButtonClick }>Add email</Button>
      </Alert>
      { authModal.open && <AuthModal initialScreen={{ type: 'email', isAuth: true }} onClose={ authModal.onClose }/> }
    </>
  );
};

export default React.memo(VerifiedAddressesEmailAlert);
