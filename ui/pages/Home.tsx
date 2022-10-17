import { VStack, Textarea, Button, Alert, AlertTitle, AlertDescription, Link, Code } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import React from 'react';

import appConfig from 'configs/app/config';
import * as cookies from 'lib/cookies';
import useToast from 'lib/hooks/useToast';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const Home = () => {
  const router = useRouter();
  const toast = useToast();

  const [ isFormVisible, setFormVisibility ] = React.useState(false);
  const [ token, setToken ] = React.useState('');

  React.useEffect(() => {
    const token = cookies.get(cookies.NAMES.API_TOKEN);
    setFormVisibility(Boolean(!token && appConfig.isAccountSupported));
  }, []);

  const checkSentry = React.useCallback(() => {
    Sentry.captureException(new Error('Test error'), { extra: { foo: 'bar' }, tags: { source: 'test' } });
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

  const prodUrl = new URL(`/${ router.query.network_type }/${ router.query.network_sub_type }`, 'https://blockscout.com').toString();

  return (
    <Page>
      <VStack gap={ 4 } alignItems="flex-start" maxW="800px">
        <PageTitle text={
          `Home Page for ${ appConfig.network.name } network`
        }/>
        <Button colorScheme="red" onClick={ checkSentry }>Check Sentry</Button>
        { /* will be deleted when we move to new CI */ }
        { isFormVisible && (
          <>
            <Alert status="error" flexDirection="column" alignItems="flex-start">
              <AlertTitle fontSize="md">
                !!! Temporary solution for authentication !!!
              </AlertTitle>
              <AlertDescription mt={ 3 }>
                To Sign in go to <Link href={ prodUrl } target="_blank">{ prodUrl }</Link> first, sign in there, copy obtained API token from cookie
                <Code ml={ 1 }>{ cookies.NAMES.API_TOKEN }</Code> and paste it in the form below. After submitting the form you should be successfully
                authenticated in current environment
              </AlertDescription>
            </Alert>
            <Textarea value={ token } onChange={ handleTokenChange } placeholder="API token"/>
            <Button onClick={ handleSetTokenClick }>Set cookie</Button>
          </>
        ) }
      </VStack>
    </Page>
  );
};

export default Home;
