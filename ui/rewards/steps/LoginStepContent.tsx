import { Text, Button, useColorModeValue, Image, Box, Flex, Switch, useBoolean, Input, FormControl, Alert } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import React, { useCallback, useState, useEffect } from 'react';

import { useRewardsContext } from 'lib/contexts/rewards';
import * as cookies from 'lib/cookies';
import { apos } from 'lib/html-entities';
import useWallet from 'lib/web3/useWallet';
import InputPlaceholder from 'ui/shared/InputPlaceholder';
import LinkExternal from 'ui/shared/links/LinkExternal';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';
import useSignInWithWallet from 'ui/snippets/auth/useSignInWithWallet';

type Props = {
  goNext: (isReferral: boolean) => void;
  closeModal: () => void;
};

const LoginStepContent = ({ goNext, closeModal }: Props) => {
  const router = useRouter();
  const { connect, isConnected, address } = useWallet({ source: 'Merits' });
  const savedRefCode = cookies.get(cookies.NAMES.REWARDS_REFERRAL_CODE);
  const [ isRefCodeUsed, setIsRefCodeUsed ] = useBoolean(Boolean(savedRefCode));
  const [ isLoading, setIsLoading ] = useBoolean(false);
  const [ refCode, setRefCode ] = useState(savedRefCode || '');
  const [ refCodeError, setRefCodeError ] = useBoolean(false);
  const dividerColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const { login } = useRewardsContext();
  const profileQuery = useProfileQuery();

  const handleRefCodeChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRefCode(event.target.value);
  }, []);

  const loginToRewardsProgram = useCallback(async() => {
    try {
      setRefCodeError.off();
      setIsLoading.on();
      const { isNewUser, invalidRefCodeError } = await login(isRefCodeUsed ? refCode : '');
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
  }, [ login, goNext, setIsLoading, router, closeModal, refCode, setRefCodeError, isRefCodeUsed ]);

  useEffect(() => {
    setRefCodeError.off();
  }, [ refCode ]); // eslint-disable-line react-hooks/exhaustive-deps

  const { start: loginToAccount } = useSignInWithWallet({
    isAuth: Boolean(!profileQuery.isLoading && profileQuery.data?.email),
    onSuccess: loginToRewardsProgram,
    onError: setIsLoading.off,
  });

  const handleLogin = useCallback(async() => {
    if (!profileQuery.isLoading && !profileQuery.data?.address_hash) {
      loginToAccount();
      return;
    }
    loginToRewardsProgram();
  }, [ loginToAccount, loginToRewardsProgram, profileQuery ]);

  const isAddressMismatch = isConnected && profileQuery.data?.address_hash !== address;

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
              isChecked={ isRefCodeUsed }
              onChange={ setIsRefCodeUsed.toggle }
              aria-label="Referral code switch"
            />
          </Flex>
          { isRefCodeUsed && (
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
      { isAddressMismatch && (
        <Alert status="warning" mt={ 4 }>
          Your wallet address doesn{ apos }t match the one in your Blockscout account. Please connect the correct wallet.
        </Alert>
      ) }
      <Button
        variant="solid"
        colorScheme="blue"
        w="full"
        whiteSpace="normal"
        mt={ isConnected ? 6 : 0 }
        mb={ 4 }
        onClick={ isConnected ? handleLogin : connect }
        isLoading={ isLoading || profileQuery.isLoading }
        isDisabled={ isAddressMismatch }
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
