import { chakra, Box, Text, Button } from '@chakra-ui/react';
import React from 'react';

import type { Screen } from '../types';
import type { UserInfo } from 'types/api/account';

interface Props {
  email: string;
  onConnectWallet: (screen: Screen) => void;
  isAuth?: boolean;
  profile: UserInfo | undefined;
}

const AuthModalScreenSuccessEmail = ({ email, onConnectWallet, isAuth, profile }: Props) => {
  const handleConnectWalletClick = React.useCallback(() => {
    onConnectWallet({ type: 'connect_wallet', isAuth: true });
  }, [ onConnectWallet ]);

  if (isAuth) {
    return (
      <Text>
        Your account was linked to{ ' ' }
        <chakra.span fontWeight="700">{ email }</chakra.span>{ ' ' }
        email. Use for the next login.
      </Text>
    );
  }

  return (
    <Box>
      <Text>
        <chakra.span fontWeight="700">{ email }</chakra.span>{ ' ' }
        email has been successfully used to log in to your Blockscout account.
      </Text>
      { !profile?.address_hash && (
        <>
          <Text mt={ 6 }>Add your web3 wallet to safely interact with smart contracts and dapps inside Blockscout.</Text>
          <Button mt={ 6 } onClick={ handleConnectWalletClick }>Connect wallet</Button>
        </>
      ) }
    </Box>
  );
};

export default React.memo(AuthModalScreenSuccessEmail);
