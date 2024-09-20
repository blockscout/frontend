import { chakra, Button, Text } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { EmailFormFields, Screen } from '../types';

import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/errors/getErrorMessage';
import useToast from 'lib/hooks/useToast';
import * as mixpanel from 'lib/mixpanel';
import FormFieldReCaptcha from 'ui/shared/forms/fields/FormFieldReCaptcha';

import AuthModalFieldEmail from '../fields/AuthModalFieldEmail';

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

  const formApi = useForm<EmailFormFields>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const onFormSubmit: SubmitHandler<EmailFormFields> = React.useCallback((formData) => {
    return apiFetch('auth_send_otp', {
      fetchParams: {
        method: 'POST',
        body: {
          email: formData.email,
          recaptcha_response: formData.reCaptcha,
        },
      },
    })
      .then(() => {
        if (isAuth) {
          mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_LINK_INFO, {
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
      })
      .catch((error) => {
        toast({
          status: 'error',
          title: 'Error',
          description: getErrorMessage(error) || 'Something went wrong',
        });
      });
  }, [ apiFetch, isAuth, onSubmit, mixpanelConfig?.account_link_info.source, toast ]);

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ formApi.handleSubmit(onFormSubmit) }
      >
        <Text>Account email, used for transaction notifications from your watchlist.</Text>
        <AuthModalFieldEmail mt={ 6 } mb={ 3 }/>
        <FormFieldReCaptcha/>
        <Button
          mt={ 6 }
          type="submit"
          isDisabled={ formApi.formState.isSubmitting || !formApi.formState.isValid }
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
