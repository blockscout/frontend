import React from 'react';

import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import AuthModal from 'ui/snippets/auth/AuthModal';

const VerifiedAddressesEmailAlert = () => {
  const authModal = useDisclosure();

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
        <Button variant="outline" size="sm" onClick={ authModal.onOpen }>Add email</Button>
      </Alert>
      { authModal.open && <AuthModal initialScreen={{ type: 'email', isAuth: true }} onClose={ authModal.onClose }/> }
    </>
  );
};

export default React.memo(VerifiedAddressesEmailAlert);
