import { Text, Button, useColorModeValue, Image, Box, Flex, Switch, useBoolean, Input, FormControl } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import React, { useCallback, useState, useEffect } from 'react';

import * as cookies from 'lib/cookies';
import useWallet from 'lib/web3/useWallet';
import InputPlaceholder from 'ui/shared/InputPlaceholder';
import LinkExternal from 'ui/shared/links/LinkExternal';

import useLogin from '../useLogin';

type Props = {
  goNext: (isReferral: boolean) => void;
  closeModal: () => void;
};

const LoginStepContent = ({ goNext, closeModal }: Props) => {
  const router = useRouter();
  const { connect, isConnected } = useWallet({ source: 'Merits' });
  const savedRefCode = cookies.get(cookies.NAMES.REWARDS_REFERRAL_CODE);
  const [ isSwitchChecked, setIsSwitchChecked ] = useBoolean(Boolean(savedRefCode));
  const [ isLoading, setIsLoading ] = useBoolean(false);
  const [ refCode, setRefCode ] = useState(savedRefCode || '');
  const [ refCodeError, setRefCodeError ] = useBoolean(false);
  const dividerColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const login = useLogin();

  const handleRefCodeChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRefCode(event.target.value);
  }, []);

  const handleLogin = useCallback(async() => {
    try {
      setRefCodeError.off();
      setIsLoading.on();
      const { isNewUser, invalidRefCodeError } = await login(refCode);
      if (invalidRefCodeError) {
        setRefCodeError.on();
      } else {
        if (isNewUser) {
          goNext(Boolean(refCode));
        } else {
          closeModal();
          router.push({ pathname: '/account/rewards' }, undefined, { shallow: true });
        }
      }
    } catch (error) {}
    setIsLoading.off();
  }, [ login, goNext, setIsLoading, router, closeModal, refCode, setRefCodeError ]);

  useEffect(() => {
    setRefCodeError.off();
  }, [ refCode ]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Image src="/static/merits_program.png" alt="Rewards program" mb={ 3 }/>
      <Box mb={ 6 }>
        Merits are awarded for a variety of different Blockscout activities. Connect a wallet to get started.
        <LinkExternal href="https://docs.blockscout.com/using-blockscout/my-account/merits" ml={ 1 } fontWeight="500">
          More about Blockscout Merits
        </LinkExternal>
      </Box>
      { isConnected && (
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
              <Input
                fontWeight="500"
                borderRadius="12px !important"
                value={ refCode }
                onChange={ handleRefCodeChange }
                isInvalid={ refCodeError }
              />
              <InputPlaceholder text="Code"/>
            </FormControl>
          ) }
        </>
      ) }
      <Button
        variant="solid"
        colorScheme="blue"
        w="full"
        mt={ isConnected ? 6 : 0 }
        mb={ 4 }
        onClick={ isConnected ? handleLogin : connect }
        isLoading={ isLoading }
      >
        { isConnected ? 'Get started' : 'Connect wallet' }
      </Button>
      <Text fontSize="sm" color={ useColorModeValue('blackAlpha.500', 'whiteAlpha.500') } textAlign="center">
        Already registered for Blockscout Merits on another network or chain? Connect the same wallet here.
      </Text>
    </>
  );
};

export default LoginStepContent;
