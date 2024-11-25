import { Text, Button, useColorModeValue, Image, Box, Flex, Switch, useBoolean, Input, FormControl, Alert, Skeleton, Divider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { useRewardsContext } from 'lib/contexts/rewards';
import * as cookies from 'lib/cookies';
import { apos } from 'lib/html-entities';
import useWallet from 'lib/web3/useWallet';
import FormInputPlaceholder from 'ui/shared/forms/inputs/FormInputPlaceholder';
import LinkExternal from 'ui/shared/links/LinkExternal';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

type Props = {
  goNext: (isReferral: boolean) => void;
  closeModal: () => void;
  openAuthModal: (isAuth: boolean) => void;
};

const LoginStepContent = ({ goNext, closeModal, openAuthModal }: Props) => {
  const router = useRouter();
  const { connect, isConnected, address } = useWallet({ source: 'Merits' });
  const savedRefCode = cookies.get(cookies.NAMES.REWARDS_REFERRAL_CODE);
  const [ isRefCodeUsed, setIsRefCodeUsed ] = useBoolean(Boolean(savedRefCode));
  const [ isLoading, setIsLoading ] = useBoolean(false);
  const [ refCode, setRefCode ] = useState(savedRefCode || '');
  const [ refCodeError, setRefCodeError ] = useBoolean(false);
  const { login, checkUserQuery } = useRewardsContext();
  const profileQuery = useProfileQuery();

  const isAddressMismatch = useMemo(() =>
    Boolean(address) &&
    Boolean(profileQuery.data?.address_hash) &&
    profileQuery.data?.address_hash !== address,
  [ address, profileQuery.data ]);

  const isLoggedIntoAccountWithWallet = useMemo(() =>
    !profileQuery.isLoading && profileQuery.data?.address_hash,
  [ profileQuery ]);

  const isSignUp = useMemo(() =>
    isConnected && !isAddressMismatch && !checkUserQuery.isFetching && !checkUserQuery.data?.exists,
  [ isConnected, isAddressMismatch, checkUserQuery ]);

  const handleRefCodeChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRefCode(event.target.value);
  }, []);

  const loginToRewardsProgram = useCallback(async() => {
    try {
      setRefCodeError.off();
      setIsLoading.on();
      const { isNewUser, invalidRefCodeError } = await login(isSignUp && isRefCodeUsed ? refCode : '');
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
  }, [ login, goNext, setIsLoading, router, closeModal, refCode, setRefCodeError, isRefCodeUsed, isSignUp ]);

  useEffect(() => {
    if (isSignUp && isRefCodeUsed && refCode.length > 0 && refCode.length !== 6) {
      setRefCodeError.on();
    } else {
      setRefCodeError.off();
    }
  }, [ refCode, isRefCodeUsed, isSignUp ]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = useCallback(async() => {
    if (isLoggedIntoAccountWithWallet) {
      loginToRewardsProgram();
    } else {
      openAuthModal(Boolean(profileQuery.data?.email));
    }
  }, [ loginToRewardsProgram, openAuthModal, isLoggedIntoAccountWithWallet, profileQuery ]);

  const buttonText = useMemo(() => {
    if (!isConnected) {
      return 'Connect wallet';
    }
    if (isLoggedIntoAccountWithWallet) {
      return 'Get started';
    }
    return profileQuery.data?.email ? 'Add wallet to account' : 'Log in to account';
  }, [ isConnected, isLoggedIntoAccountWithWallet, profileQuery.data ]);

  return (
    <>
      <Image
        src="/static/merits_program.png"
        alt="Merits program"
        mb={ 3 }
        fallback={ <Skeleton w="full" h="120px" mb={ 3 }/> }
      />
      <Box mb={ 6 }>
        Merits are awarded for a variety of different Blockscout activities. Connect a wallet to get started.
        <LinkExternal href="https://docs.blockscout.com/using-blockscout/merits" ml={ 1 } fontWeight="500">
          More about Blockscout Merits
        </LinkExternal>
      </Box>
      { isSignUp && isLoggedIntoAccountWithWallet && (
        <Box mb={ 6 }>
          <Divider bgColor="divider" mb={ 6 }/>
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
            <>
              <FormControl variant="floating" id="referral-code" mt={ 3 }>
                <Input
                  fontWeight="500"
                  value={ refCode }
                  onChange={ handleRefCodeChange }
                  isInvalid={ refCodeError }
                />
                <FormInputPlaceholder text="Code"/>
              </FormControl>
              <Text fontSize="sm" variant="secondary" mt={ 1 } color={ refCodeError ? 'red.500' : undefined }>
                { refCodeError ? 'Incorrect code or format' : 'The code should be in format XXXXXX' }
              </Text>
            </>
          ) }
        </Box>
      ) }
      { isAddressMismatch && (
        <Alert status="warning" mb={ 4 }>
          Your wallet address doesn{ apos }t match the one in your Blockscout account. Please connect the correct wallet.
        </Alert>
      ) }
      <Button
        variant="solid"
        colorScheme="blue"
        w="full"
        whiteSpace="normal"
        mb={ 4 }
        onClick={ isConnected ? handleLogin : connect }
        isLoading={ isLoading || profileQuery.isLoading || checkUserQuery.isFetching }
        loadingText={ isLoading ? 'Sign message in your wallet' : undefined }
        isDisabled={ isAddressMismatch || refCodeError }
      >
        { buttonText }
      </Button>
      <Text fontSize="sm" color={ useColorModeValue('blackAlpha.500', 'whiteAlpha.500') } textAlign="center">
        Already registered for Blockscout Merits on another network or chain? Connect the same wallet here.
      </Text>
    </>
  );
};

export default LoginStepContent;
