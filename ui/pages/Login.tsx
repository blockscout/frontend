import { VStack, Textarea, Button, Alert, AlertTitle, AlertDescription, Code, Flex, Box } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import mixpanel from 'mixpanel-browser';
import type { ChangeEvent } from 'react';
import React from 'react';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import useToast from 'lib/hooks/useToast';
import PageTitle from 'ui/shared/Page/PageTitle';

{ /* will be deleted when we fix login in preview CI stands */ }
const Login = () => {
  const toast = useToast();
  const [ num, setNum ] = useGradualIncrement(0);

  const [ isFormVisible, setFormVisibility ] = React.useState(false);
  const [ token, setToken ] = React.useState('');

  React.useEffect(() => {
    const token = cookies.get(cookies.NAMES.API_TOKEN);
    setFormVisibility(Boolean(!token && config.features.account.isEnabled));
    // throw new Error('Test error');
  }, []);

  const checkSentry = React.useCallback(() => {
    Sentry.captureException(new Error('Test error'), { tags: { source: 'test' } });
  }, []);

  const checkMixpanel = React.useCallback(() => {
    mixpanel.track('Test event', { my_prop: 'foo bar' });
  }, []);

  const handleTokenChange = React.useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setToken(event.target.value);
  }, []);

  const handleSetTokenClick = React.useCallback(() => {
    cookies.set(cookies.NAMES.API_TOKEN, token);
    setToken('');
    toast({
      position: 'top-right',
      title: 'Success 🥳',
      description: 'Successfully set cookie',
      status: 'success',
      variant: 'subtle',
      isClosable: true,
      onCloseComplete: () => {
        setFormVisibility(false);
      },
    });
  }, [ toast, token ]);

  const handleNumIncrement = React.useCallback(() => {
    for (let index = 0; index < 5; index++) {
      setNum(5);
    }
  }, [ setNum ]);

  return (
    <VStack gap={ 4 } alignItems="flex-start" maxW="1000px">
      <PageTitle title="Login page 😂"/>
      { isFormVisible && (
        <>
          <Alert status="error" flexDirection="column" alignItems="flex-start">
            <AlertTitle fontSize="md">
                !!! Temporary solution for authentication on localhost !!!
            </AlertTitle>
            <AlertDescription mt={ 3 }>
                    To Sign in go to production instance first, sign in there, copy obtained API token from cookie
              <Code ml={ 1 }>{ cookies.NAMES.API_TOKEN }</Code> and paste it in the form below. After submitting the form you should be successfully
                    authenticated in current environment
            </AlertDescription>
          </Alert>
          <Textarea value={ token } onChange={ handleTokenChange } placeholder="API token"/>
          <Button onClick={ handleSetTokenClick }>Set cookie</Button>
        </>
      ) }
      <Button colorScheme="red" onClick={ checkSentry }>Check Sentry</Button>
      <Button colorScheme="teal" onClick={ checkMixpanel }>Check Mixpanel</Button>
      <Flex columnGap={ 2 } alignItems="center">
        <Box w="50px" textAlign="center">{ num }</Box>
        <Button onClick={ handleNumIncrement } size="sm">add</Button>
      </Flex>
    </VStack>
  );

};

export default Login;
