// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import AuthModal from 'src/features/account/components/auth-modal/AuthModal';

import { Alert } from 'src/toolkit/chakra/alert';
import { Button } from 'src/toolkit/chakra/button';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

const WatchlistEmailAlert = () => {
  const authModal = useDisclosure();

  return (
    <>
      <Alert
        status="info"
        descriptionProps={{ alignItems: 'center', gap: 2 }}
        w="fit-content"
        mb={ 6 }
      >
        To receive notifications you need to add an email to your profile.
        <Button variant="outline" size="sm" onClick={ authModal.onOpen }>Add email</Button>
      </Alert>
      { authModal.open && <AuthModal initialScreen={{ type: 'email', isAuth: true }} onClose={ authModal.onClose }/> }
    </>
  );
};

export default React.memo(WatchlistEmailAlert);
