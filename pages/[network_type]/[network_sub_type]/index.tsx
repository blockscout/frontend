import { VStack, Textarea, Button, Alert, AlertTitle, AlertDescription, Link, Code } from '@chakra-ui/react';
import capitalize from 'lodash/capitalize';
import type { NextPage, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';
import React from 'react';

import * as cookies from 'lib/cookies';
import useNetwork from 'lib/hooks/useNetwork';
import useToast from 'lib/hooks/useToast';
import getAvailablePaths from 'lib/networks/getAvailablePaths';
import Page from 'ui/shared/Page';
import PageHeader from 'ui/shared/PageHeader';

const Home: NextPage = () => {
  const router = useRouter();
  const selectedNetwork = useNetwork();
  const toast = useToast();

  const [ isFormVisible, setFormVisibility ] = React.useState(false);
  const [ token, setToken ] = React.useState('');

  React.useEffect(() => {
    const token = cookies.get(cookies.NAMES.API_TOKEN);
    if (!token && selectedNetwork?.isAccountSupported) {
      setFormVisibility(true);
    }
  }, [ selectedNetwork?.isAccountSupported ]);

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
        <PageHeader text={
          `Home Page for ${ capitalize(router.query.network_type as string) } ${ capitalize(router.query.network_sub_type as string) } network`
        }/>
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

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: getAvailablePaths(), fallback: false };
};

export const getStaticProps = async() => {
  return {
    props: {},
  };
};
