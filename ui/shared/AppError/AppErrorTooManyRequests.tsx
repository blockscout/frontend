import { Box, Heading, Icon, Text, chakra } from '@chakra-ui/react';
import React from 'react';
import ReCaptcha from 'react-google-recaptcha';

import appConfig from 'configs/app/config';
import icon429 from 'icons/error-pages/429.svg';
import buildUrl from 'lib/api/buildUrl';
import useFetch from 'lib/hooks/useFetch';
import useToast from 'lib/hooks/useToast';

interface Props {
  className?: string;
}

const AppErrorTooManyRequests = ({ className }: Props) => {
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
      className={ className }
      sx={{
        '.recaptcha': {
          mt: 8,
          h: '78px', // otherwise content will jump after reCaptcha is loaded
        },
      }}
    >
      <Icon as={ icon429 } width="200px" height="auto"/>
      <Heading mt={ 8 } size="2xl" fontFamily="body">Too many requests</Heading>
      <Text variant="secondary" mt={ 3 }>
        You have exceeded the request rate for a given time period. Please reduce the number of requests and try again soon.
      </Text>
      { appConfig.reCaptcha.siteKey && (
        <ReCaptcha
          className="recaptcha"
          sitekey={ appConfig.reCaptcha.siteKey }
          onChange={ handleReCaptchaChange }
        />
      ) }
    </Box>
  );
};

export default chakra(AppErrorTooManyRequests);
