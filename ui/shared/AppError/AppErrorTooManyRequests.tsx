import { Box, Heading, Icon, Text, chakra } from '@chakra-ui/react';
import React from 'react';
import ReCaptcha from 'react-google-recaptcha';

import appConfig from 'configs/app/config';
import icon404 from 'icons/error-pages/404.svg';
import buildUrl from 'lib/api/buildUrl';
import * as cookies from 'lib/cookies';
import useToast from 'lib/hooks/useToast';

interface Props {
  className?: string;
}

const AppErrorTooManyRequests = ({ className }: Props) => {
  const toast = useToast();

  const handleReCaptchaChange = React.useCallback(async(token: string | null) => {

    if (token) {
      try {
        const url = buildUrl('client_key', undefined, { recaptcha_response: token });

        const response = await fetch(url);
        const data = await response.json();

        if (!(typeof data === 'object' && data !== null && 'key' in data && typeof data.key === 'string')) {
          throw Error('Invalid response from "Client key" resource.');
        }

        cookies.set(cookies.NAMES.CLIENT_KEY, data.key, { expires: 5 / 24 }); // set cookie for 5 hours === key lifetime
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
  }, [ toast ]);

  return (
    <Box
      className={ className }
      sx={{
        '.recaptcha': {
          mt: 6,
        },
      }}
    >
      <Icon as={ icon404 } width="200px" height="auto"/>
      <Heading mt={ 8 } size="2xl" fontFamily="body">Too many requests</Heading>
      <Text variant="secondary" mt={ 3 }>
        Chill on the couch table curl into a furry donut i hate cucumber pls do not throw it at me i like frogs and 0 gravity bite off human toes.
        Curl into a furry donut why dog in house?
      </Text>
      { appConfig.reCaptcha.siteKey && (
        <ReCaptcha
          className="recaptcha"
          //   ref={ ref }
          sitekey={ appConfig.reCaptcha.siteKey }
          onChange={ handleReCaptchaChange }
        />
      ) }
    </Box>
  );
};

export default chakra(AppErrorTooManyRequests);
