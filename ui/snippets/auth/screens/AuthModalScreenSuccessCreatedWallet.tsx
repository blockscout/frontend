import { chakra, Box, Text, Button } from '@chakra-ui/react';
import React from 'react';

import type { Screen } from '../types';

import shortenString from 'lib/shortenString';

interface Props {
  address: string;
  onAddEmail: (screen: Screen) => void;
}

const AuthModalScreenSuccessCreatedWallet = ({ address, onAddEmail }: Props) => {
  const handleAddEmailClick = React.useCallback(() => {
    onAddEmail({ type: 'email', isAccountExists: true });
  }, [ onAddEmail ]);

  return (
    <Box>
      <Text>
        Your account was linked to{ ' ' }
        <chakra.span fontWeight="700">{ shortenString(address) }</chakra.span>{ ' ' }
        wallet. Use for the next login.
      </Text>
      <Text mt={ 6 }>Add your email to receive notifications about addresses in your watch list.</Text>
      <Button mt={ 6 } onClick={ handleAddEmailClick }>Add email</Button>
    </Box>
  );
};

export default React.memo(AuthModalScreenSuccessCreatedWallet);
