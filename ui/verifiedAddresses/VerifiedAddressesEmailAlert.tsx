import { Alert, Button, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import AuthModal from 'ui/snippets/auth/AuthModal';

const VerifiedAddressesEmailAlert = () => {
  const authModal = useDisclosure();

  return (
    <>
      <Alert
        status="warning"
        mb={ 6 }
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'flex-start', lg: 'center' }}
        columnGap={ 2 }
        rowGap={ 2 }
      >
        You need a valid email address to verify contracts. Please add your email to your account.
        <Button variant="outline" size="sm" onClick={ authModal.onOpen }>Add email</Button>
      </Alert>
      { authModal.isOpen && <AuthModal initialScreen={{ type: 'email', isAuth: true }} onClose={ authModal.onClose }/> }
    </>
  );
};

export default React.memo(VerifiedAddressesEmailAlert);
