import { chakra, Button, Text } from '@chakra-ui/react';
import React from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { EmailFormFields, Screen } from '../types';

import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/errors/getErrorMessage';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import useToast from 'lib/hooks/useToast';
import * as mixpanel from 'lib/mixpanel';
import FormFieldEmail from 'ui/shared/forms/fields/FormFieldEmail';

interface Props {
  onSubmit: (screen: Screen) => void;
  isAuth?: boolean;
  mixpanelConfig?: {
    account_link_info: {
      source: mixpanel.EventPayload<mixpanel.EventTypes.ACCOUNT_LINK_INFO>['Source'];
    };
  };
}

const AuthModalScreenEmail = ({ onSubmit, isAuth, mixpanelConfig }: Props) => {

  const apiFetch = useApiFetch();
  const toast = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const formApi = useForm<EmailFormFields>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const onFormSubmit: SubmitHandler<EmailFormFields> = React.useCallback(async(formData) => {
    try {
      const token = await executeRecaptcha?.();
      await apiFetch('auth_send_otp', {
        fetchParams: {
          method: 'POST',
          body: {
            email: formData.email,
            recaptcha_v3_response: token,
          },
        },
      });
      if (isAuth) {
        mixpanelConfig?.account_link_info.source !== 'Profile' && mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_LINK_INFO, {
          Source: mixpanelConfig?.account_link_info.source ?? 'Profile dropdown',
          Status: 'OTP sent',
          Type: 'Email',
        });
      } else {
        mixpanel.logEvent(mixpanel.EventTypes.LOGIN, {
          Action: 'OTP sent',
          Source: 'Email',
        });
      }
      onSubmit({ type: 'otp_code', email: formData.email, isAuth });
    } catch (error) {
      toast({
        status: 'error',
        title: 'Error',
        description: getErrorObjPayload<{ message: string }>(error)?.message || getErrorMessage(error) || 'Something went wrong',
      });
    }
  }, [ executeRecaptcha, apiFetch, isAuth, onSubmit, mixpanelConfig?.account_link_info.source, toast ]);

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ formApi.handleSubmit(onFormSubmit) }
      >
        <Text>Account email, used for transaction notifications from your watchlist.</Text>
        <FormFieldEmail<EmailFormFields>
          name="email"
          isRequired
          placeholder="Email"
          bgColor="dialog_bg"
          mt={ 6 }
        />
        <Button
          mt={ 6 }
          type="submit"
          isDisabled={ formApi.formState.isSubmitting }
          isLoading={ formApi.formState.isSubmitting }
          loadingText="Send a code"
        >
          Send a code
        </Button>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(AuthModalScreenEmail);
