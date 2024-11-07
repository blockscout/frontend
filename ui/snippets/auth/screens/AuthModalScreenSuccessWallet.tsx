import { chakra, Box, Text, Button, Flex } from '@chakra-ui/react';
import React from 'react';

import type { Screen } from '../types';
import type { UserInfo } from 'types/api/account';

import config from 'configs/app';
import { apos } from 'lib/html-entities';
import shortenString from 'lib/shortenString';

interface Props {
  address: string;
  onAddEmail: (screen: Screen) => void;
  onClose: () => void;
  isAuth?: boolean;
  profile: UserInfo | undefined;
}

const AuthModalScreenSuccessWallet = ({ address, onAddEmail, onClose, isAuth, profile }: Props) => {
  const handleAddEmailClick = React.useCallback(() => {
    onAddEmail({ type: 'email', isAuth: true });
  }, [ onAddEmail ]);

  if (isAuth) {
    return (
      <Box>
        <Text>
          Your account was linked to{ ' ' }
          <chakra.span fontWeight="700">{ shortenString(address) }</chakra.span>{ ' ' }
          wallet. Use for the next login.
        </Text>
        <Button
          mt={ 6 }
          variant="outline"
          onClick={ onClose }
        >
          Got it!
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Text>
        Wallet{ ' ' }
        <chakra.span fontWeight="700">{ shortenString(address) }</chakra.span>{ ' ' }
        has been successfully used to log in to your Blockscout account.
      </Text>
      { !profile?.email ? (
        <>
          <Text mt={ 6 }>
            Add your email to receive exclusive updates about Blockscout { config.features.rewards.isEnabled ? 'Merits ' : ' ' }
            and notifications about addresses in your watch list.
          </Text>
          <Flex mt={ 6 } gap={ 2 }>
            <Button onClick={ handleAddEmailClick }>Add email</Button>
            <Button variant="simple" onClick={ onClose }>I{ apos }ll do it later</Button>
          </Flex>
        </>
      ) : (
        <Button
          mt={ 6 }
          variant="outline"
          onClick={ onClose }
        >
          Got it!
        </Button>
      ) }
    </Box>
  );
};

export default React.memo(AuthModalScreenSuccessWallet);
