import { Text, Button, useColorModeValue, Image, Box, Flex, Switch, useBoolean, Input, FormControl } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import InputPlaceholder from 'ui/shared/InputPlaceholder';
import LinkExternal from 'ui/shared/links/LinkExternal';
import useWallet from 'ui/snippets/walletMenu/useWallet';

import useLogin from '../useLogin';

type Props = {
  goNext: () => void;
  closeModal: () => void;
};

const LoginStepContent = ({ goNext, closeModal }: Props) => {
  const router = useRouter();
  const { connect, isWalletConnected } = useWallet({ source: 'Merits' });
  const [ isSwitchChecked, setIsSwitchChecked ] = useBoolean(false);
  const [ isLoading, setIsLoading ] = useBoolean(false);
  const dividerColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const login = useLogin();

  const handleLogin = useCallback(async() => {
    try {
      setIsLoading.on();
      const { isNewUser } = await login();
      if (isNewUser) {
        goNext();
      } else {
        closeModal();
        router.push({ pathname: '/account/rewards' }, undefined, { shallow: true });
      }
    } catch (error) {}
    setIsLoading.off();
  }, [ login, goNext, setIsLoading, router, closeModal ]);

  return (
    <>
      <Image src="/static/merits_program.png" alt="Rewards program" mb={ 3 }/>
      <Box mb={ 6 }>
        Merits are awarded for a variety of different Blockscout activities. Connect a wallet to get started.
        <LinkExternal href="https://docs.blockscout.com/using-blockscout/my-account/merits" ml={ 1 } fontWeight="500">
          More about Blockscout Merits
        </LinkExternal>
      </Box>
      { isWalletConnected && (
        <>
          <Box w="full" mb={ 6 } borderTop="1px solid" borderColor={ dividerColor }/>
          <Flex w="full" alignItems="center" justifyContent="space-between">
            I have a referral code
            <Switch
              colorScheme="blue"
              size="md"
              isChecked={ isSwitchChecked }
              onChange={ setIsSwitchChecked.toggle }
              aria-label="Referral code switch"
            />
          </Flex>
          { isSwitchChecked && (
            <FormControl variant="floating" id="referral-code" mt={ 3 }>
              <Input fontWeight="500" borderRadius="12px !important"/>
              <InputPlaceholder text="Code"/>
            </FormControl>
          ) }
        </>
      ) }
      <Button
        variant="solid"
        colorScheme="blue"
        w="full"
        mt={ isWalletConnected ? 6 : 0 }
        mb={ 4 }
        onClick={ isWalletConnected ? handleLogin : connect }
        isLoading={ isLoading }
      >
        { isWalletConnected ? 'Get started' : 'Connect wallet' }
      </Button>
      <Text fontSize="sm" color={ useColorModeValue('blackAlpha.500', 'whiteAlpha.500') } textAlign="center">
        Already registered for Blockscout Merits on another network or chain? Connect the same wallet here.
      </Text>
    </>
  );
};

export default LoginStepContent;
