import { Box, Text, Button, Heading, Icon, chakra } from '@chakra-ui/react';
import React from 'react';

import icon404 from 'icons/error-pages/404.svg';
import useApiFetch from 'lib/api/useApiFetch';
import dayjs from 'lib/date/dayjs';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import getErrorObjStatusCode from 'lib/errors/getErrorObjStatusCode';
import useToast from 'lib/hooks/useToast';

interface Props {
  className?: string;
}

const AppErrorUnverifiedEmail = ({ className }: Props) => {
  const apiFetch = useApiFetch();
  const toast = useToast();

  const handleButtonClick = React.useCallback(async() => {
    const toastId = 'resend-email-error';

    try {
      await apiFetch('email_resend');
      toast({
        id: toastId,
        position: 'top-right',
        title: 'Success',
        description: 'Email successfully resent.',
        status: 'success',
        variant: 'subtle',
        isClosable: true,
      });
    } catch (error) {
      const statusCode = getErrorObjStatusCode(error);

      const message = (() => {
        if (statusCode !== 429) {
          return;
        }

        const payload = getErrorObjPayload<{ seconds_before_next_resend: number }>(error);
        if (!payload) {
          return;
        }

        const timeUntilNextResend = dayjs().add(payload.seconds_before_next_resend, 'seconds').fromNow();
        return `Email resend is available ${ timeUntilNextResend }.`;
      })();

      !toast.isActive(toastId) && toast({
        id: toastId,
        position: 'top-right',
        title: 'Error',
        description: message || 'Something went wrong. Try again later.',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [ apiFetch, toast ]);

  return (
    <Box className={ className }>
      <Icon as={ icon404 } width="200px" height="auto"/>
      <Heading mt={ 8 } size="2xl" fontFamily="body">Email is not verified</Heading>
      <Text variant="secondary" mt={ 3 }>
        Please confirm your email address to use the My Account feature. A confirmation email was sent to test@gmail.com on signup. { `Didn't receive?` }
      </Text>
      <Button
        mt={ 8 }
        size="lg"
        variant="outline"
        onClick={ handleButtonClick }
      >
        Resend verification email
      </Button>
    </Box>
  );
};

export default chakra(AppErrorUnverifiedEmail);
