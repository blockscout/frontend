import { chakra, Box, Text, Button } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { OtpCodeFormFields, ScreenSuccess } from '../types';
import type { UserInfo } from 'types/api/account';

import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/errors/getErrorMessage';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import useToast from 'lib/hooks/useToast';
import IconSvg from 'ui/shared/IconSvg';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

import AuthModalFieldOtpCode from '../fields/AuthModalFieldOtpCode';

interface Props {
  email: string;
  onSuccess: (screen: ScreenSuccess) => void;
  isAuth?: boolean;
}

const AuthModalScreenOtpCode = ({ email, onSuccess, isAuth }: Props) => {

  const apiFetch = useApiFetch();
  const toast = useToast();
  const recaptcha = useReCaptcha();
  const [ isCodeSending, setIsCodeSending ] = React.useState(false);

  const formApi = useForm<OtpCodeFormFields>({
    mode: 'onBlur',
    defaultValues: {
      code: '',
    },
  });

  const onFormSubmit: SubmitHandler<OtpCodeFormFields> = React.useCallback((formData) => {
    const resource = isAuth ? 'auth_link_email' : 'auth_confirm_otp';
    return apiFetch<typeof resource, UserInfo, unknown>(resource, {
      fetchParams: {
        method: 'POST',
        body: {
          otp: formData.code,
          email,
        },
      },
    })
      .then((response) => {
        if (!('name' in response)) {
          throw Error('Something went wrong');
        }
        onSuccess({ type: 'success_email', email, isAuth, profile: response });
      })
      .catch((error) => {
        const apiError = getErrorObjPayload<{ message: string }>(error);

        if (apiError?.message) {
          formApi.setError('code', { message: apiError.message });
          return;
        }

        toast({
          status: 'error',
          title: 'Error',
          description: getErrorMessage(error) || 'Something went wrong',
        });
      });
  }, [ apiFetch, email, onSuccess, isAuth, toast, formApi ]);

  const handleResendCodeClick = React.useCallback(async() => {
    try {
      formApi.clearErrors('code');
      setIsCodeSending(true);
      const token = await recaptcha.executeAsync();
      await apiFetch('auth_send_otp', {
        fetchParams: {
          method: 'POST',
          body: { email, recaptcha_response: token },
        },
      });

      toast({
        status: 'success',
        title: 'Success',
        description: 'Code has been sent to your email',
      });
    } catch (error) {
      const apiError = getErrorObjPayload<{ message: string }>(error);

      toast({
        status: 'error',
        title: 'Error',
        description: apiError?.message || getErrorMessage(error) || 'Something went wrong',
      });
    } finally {
      setIsCodeSending(false);
    }
  }, [ apiFetch, email, formApi, toast, recaptcha ]);

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
        <AuthModalFieldOtpCode isDisabled={ isCodeSending }/>
        <ReCaptcha ref={ recaptcha.ref }/>
        <Button
          variant="link"
          display="flex"
          alignItems="center"
          columnGap={ 2 }
          mt={ 3 }
          fontWeight="400"
          w="fit-content"
          isDisabled={ isCodeSending }
          onClick={ handleResendCodeClick }
        >
          <IconSvg name="repeat" boxSize={ 5 }/>
          <Box fontSize="sm">Resend code</Box>
        </Button>
        <Button
          mt={ 6 }
          type="submit"
          isLoading={ formApi.formState.isSubmitting }
          isDisabled={ formApi.formState.isSubmitting || isCodeSending }
          loadingText="Submit"
          onClick={ formApi.handleSubmit(onFormSubmit) }
        >
          Submit
        </Button>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(AuthModalScreenOtpCode);
