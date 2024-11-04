import { Button, Text } from '@chakra-ui/react';
import React from 'react';
import { GoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import config from 'configs/app';
import buildUrl from 'lib/api/buildUrl';
import useFetch from 'lib/hooks/useFetch';
import useToast from 'lib/hooks/useToast';

import AppErrorIcon from '../AppErrorIcon';
import AppErrorTitle from '../AppErrorTitle';

const AppErrorTooManyRequests = () => {
  const toast = useToast();
  const fetch = useFetch();
  const [ token, setToken ] = React.useState<string | undefined>(undefined);

  const handleReCaptchaChange = React.useCallback(async(token: string) => {
    setToken(token);
  }, [ ]);

  const handleSubmit = React.useCallback(async() => {
    try {
      const url = buildUrl('api_v2_key');

      await fetch(url, {
        method: 'POST',
        body: { recaptcha_v3_response: token },
        credentials: 'include',
      }, {
        resource: 'api_v2_key',
      });

      window.location.reload();

    } catch (error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: 'Unable to get client key.',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [ token, toast, fetch ]);

  if (!config.services.reCaptchaV3.siteKey) {
    throw new Error('reCAPTCHA V3 site key is not set');
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={ config.services.reCaptchaV3.siteKey }>
      <AppErrorIcon statusCode={ 429 }/>
      <AppErrorTitle title="Too many requests"/>
      <Text variant="secondary" mt={ 3 }>
        You have exceeded the request rate for a given time period. Please reduce the number of requests and try again soon.
      </Text>
      <GoogleReCaptcha
        onVerify={ handleReCaptchaChange }
        refreshReCaptcha
      />
      <Button onClick={ handleSubmit } mt={ 8 }>Try again</Button>
    </GoogleReCaptchaProvider>
  );
};

export default AppErrorTooManyRequests;
