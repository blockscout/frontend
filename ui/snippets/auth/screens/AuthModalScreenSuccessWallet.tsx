import { chakra, Box, Text, Button } from '@chakra-ui/react';
import React from 'react';

import type { Screen } from '../types';
import type { UserInfo } from 'types/api/account';

import shortenString from 'lib/shortenString';

interface Props {
  address: string;
  onAddEmail: (screen: Screen) => void;
  isAuth?: boolean;
  profile: UserInfo | undefined;
}

const AuthModalScreenSuccessWallet = ({ address, onAddEmail, isAuth, profile }: Props) => {
  const handleAddEmailClick = React.useCallback(() => {
    onAddEmail({ type: 'email', isAuth: true });
  }, [ onAddEmail ]);

  if (isAuth) {
    return (
      <Text>
        Your account was linked to{ ' ' }
        <chakra.span fontWeight="700">{ shortenString(address) }</chakra.span>{ ' ' }
        wallet. Use for the next login.
      </Text>
    );
  }

  return (
    <Box>
      <Text>
        Wallet{ ' ' }
        <chakra.span fontWeight="700">{ shortenString(address) }</chakra.span>{ ' ' }
        has been successfully used to log in to your Blockscout account.
      </Text>
      { !profile?.email && (
        <>
          <Text mt={ 6 }>Add your email to receive notifications about addresses in your watch list.</Text>
          <Button mt={ 6 } onClick={ handleAddEmailClick }>Add email</Button>
        </>
      ) }
    </Box>
  );
};

export default React.memo(AuthModalScreenSuccessWallet);
