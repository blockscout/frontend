import { chakra, Box, Text, Button, Link } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { OtpCodeFormFields, Screen } from '../types';

import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/errors/getErrorMessage';
import useToast from 'lib/hooks/useToast';
import IconSvg from 'ui/shared/IconSvg';

import AuthModalFieldOtpCode from '../fields/AuthModalFieldOtpCode';

interface Props {
  email: string;
  onSubmit: (screen: Screen) => void;
}

const AuthModalScreenOtpCode = ({ email, onSubmit }: Props) => {

  const apiFetch = useApiFetch();
  const toast = useToast();

  const formApi = useForm<OtpCodeFormFields>({
    mode: 'onBlur',
    defaultValues: {
      code: '',
    },
  });

  const onFormSubmit: SubmitHandler<OtpCodeFormFields> = React.useCallback((formData) => {
    return apiFetch('auth_confirm_otp', {
      fetchParams: {
        method: 'POST',
        body: {
          otp: formData.code,
          email,
        },
      },
    })
      .then(() => {
        onSubmit({ type: 'success_created_email' });
      })
      .catch((error) => {
        // TODO @tom2drum handle incorrect code error
        toast({
          status: 'error',
          title: 'Error',
          description: getErrorMessage(error) || 'Something went wrong',
        });
      });
  }, [ apiFetch, email, onSubmit, toast ]);

  const handleResendCodeClick = React.useCallback(() => {
    return apiFetch('auth_send_otp', {
      fetchParams: {
        method: 'POST',
        body: {
          email,
        },
      },
    })
      .then(() => {
        toast({
          status: 'success',
          title: 'Code sent',
          description: 'Code has been sent to your email',
        });
      })
      .catch((error) => {
        toast({
          status: 'error',
          title: 'Error',
          description: getErrorMessage(error) || 'Something went wrong',
        });
      });
  }, [ apiFetch, email, toast ]);

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ formApi.handleSubmit(onFormSubmit) }
      >
        <Text mb={ 6 }>
          Please check{ ' ' }
          <chakra.span fontWeight="700">{ email }</chakra.span>{ ' ' }
          and enter your code below.
        </Text>
        <AuthModalFieldOtpCode/>
        <Link
          display="flex"
          alignItems="center"
          gap={ 2 }
          mt={ 3 }
          w="fit-content"
          onClick={ handleResendCodeClick }
        >
          <IconSvg name="repeat" boxSize={ 5 }/>
          <Box fontSize="sm">Resend code</Box>
        </Link>
        <Button
          mt={ 6 }
          type="submit"
          isLoading={ formApi.formState.isSubmitting }
          onClick={ formApi.handleSubmit(onFormSubmit) }
        >
          Submit
        </Button>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(AuthModalScreenOtpCode);
