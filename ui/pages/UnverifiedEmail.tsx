import { Box, Text, Button, Heading, chakra } from '@chakra-ui/react';
import React from 'react';

import useApiFetch from 'lib/api/useApiFetch';
import dayjs from 'lib/date/dayjs';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import getErrorObjStatusCode from 'lib/errors/getErrorObjStatusCode';
import useToast from 'lib/hooks/useToast';
import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  email?: string; // TODO: obtain email from API
}

const UnverifiedEmail = ({ email }: Props) => {
  const apiFetch = useApiFetch();
  const [ isLoading, setIsLoading ] = React.useState(false);
  const toast = useToast();

  const handleButtonClick = React.useCallback(async() => {
    const toastId = 'resend-email-error';

    setIsLoading(true);

    mixpanel.logEvent(
      mixpanel.EventTypes.ACCOUNT_ACCESS,
      { Action: 'Verification email resent' },
    );

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

        if (!payload.seconds_before_next_resend) {
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

    setIsLoading(false);
  }, [ apiFetch, toast ]);

  return (
    <Box>
      <IconSvg name="email-sent" width="180px" height="auto" mt="52px"/>
      <Heading mt={ 6 } size="2xl">Verify your email address</Heading>
      <Text variant="secondary" mt={ 3 }>
        <span>Please confirm your email address to use the My Account feature. A confirmation email was sent to </span>
        <span>{ email || 'your email address' }</span>
        <span> on signup. { `Didn't receive?` }</span>
      </Text>
      <Button
        mt={ 8 }
        size="lg"
        variant="outline"
        isLoading={ isLoading }
        loadingText="Resending..."
        onClick={ handleButtonClick }
      >
        Resend verification email
      </Button>
    </Box>
  );
};

export default chakra(UnverifiedEmail);
