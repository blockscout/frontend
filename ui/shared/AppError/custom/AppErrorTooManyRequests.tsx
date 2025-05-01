import { Text } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import buildUrl from 'lib/api/buildUrl';
import useFetch from 'lib/hooks/useFetch';
import { Button } from 'toolkit/chakra/button';
import { toaster } from 'toolkit/chakra/toaster';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

import AppErrorIcon from '../AppErrorIcon';
import AppErrorTitle from '../AppErrorTitle';

const AppErrorTooManyRequests = () => {
  const fetch = useFetch();
  const recaptcha = useReCaptcha();

  const handleSubmit = React.useCallback(async() => {
    try {
      const token = await recaptcha.executeAsync();
      const url = buildUrl('general:api_v2_key');

      await fetch(url, {
        method: 'POST',
        body: { recaptcha_response: token },
        credentials: 'include',
      }, {
        resource: 'general:api_v2_key',
      });

      window.location.reload();

    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'Unable to get client key.',
        type: 'error',
      });
    }
  }, [ recaptcha, fetch ]);

  if (!config.services.reCaptchaV2.siteKey) {
    throw new Error('reCAPTCHA V2 site key is not set');
  }

  return (
    <>
      <AppErrorIcon statusCode={ 429 }/>
      <AppErrorTitle title="Too many requests"/>
      <Text color="text.secondary" mt={ 3 }>
        You have exceeded the request rate for a given time period. Please reduce the number of requests and try again soon.
      </Text>
      <ReCaptcha { ...recaptcha }/>
      <Button onClick={ handleSubmit } disabled={ recaptcha.isInitError } mt={ 8 }>Try again</Button>
    </>
  );
};

export default AppErrorTooManyRequests;
