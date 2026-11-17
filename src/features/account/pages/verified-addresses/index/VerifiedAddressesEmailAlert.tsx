// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import AuthModal from 'src/features/account/components/auth-modal/AuthModal';

import { Alert } from 'src/toolkit/chakra/alert';
import { Button } from 'src/toolkit/chakra/button';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

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
