import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import ReCaptcha from 'react-google-recaptcha';

import config from 'configs/app';
import buildUrl from 'lib/api/buildUrl';
import useFetch from 'lib/hooks/useFetch';
import useToast from 'lib/hooks/useToast';

import AppErrorIcon from '../AppErrorIcon';
import AppErrorTitle from '../AppErrorTitle';

const AppErrorTooManyRequests = () => {
  const toast = useToast();
  const fetch = useFetch();

  const handleReCaptchaChange = React.useCallback(async(token: string | null) => {

    if (token) {
      try {
        const url = buildUrl('api_v2_key');

        await fetch(url, {
          method: 'POST',
          body: { recaptcha_response: token },
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
    }
  }, [ toast, fetch ]);

  return (
    <Box
      sx={{
        '.recaptcha': {
          mt: 8,
          h: '78px', // otherwise content will jump after reCaptcha is loaded
        },
      }}
    >
      <AppErrorIcon statusCode={ 429 }/>
      <AppErrorTitle title="Too many requests"/>
      <Text variant="secondary" mt={ 3 }>
        You have exceeded the request rate for a given time period. Please reduce the number of requests and try again soon.
      </Text>
      { config.services.reCaptcha.siteKey && (
        <ReCaptcha
          className="recaptcha"
          sitekey={ config.services.reCaptcha.siteKey }
          onChange={ handleReCaptchaChange }
        />
      ) }
    </Box>
  );
};

export default AppErrorTooManyRequests;
