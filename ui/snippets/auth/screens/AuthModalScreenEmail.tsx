import { chakra, Text } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { EmailFormFields, Screen } from '../types';

import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/errors/getErrorMessage';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import * as mixpanel from 'lib/mixpanel';
import { Button } from 'toolkit/chakra/button';
import { toaster } from 'toolkit/chakra/toaster';
import FormFieldEmail from 'ui/shared/forms/fields/FormFieldEmail';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

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
  const recaptcha = useReCaptcha();

  const formApi = useForm<EmailFormFields>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const onFormSubmit: SubmitHandler<EmailFormFields> = React.useCallback(async(formData) => {
    try {
      const token = await recaptcha.executeAsync();

      await apiFetch('auth_send_otp', {
        fetchParams: {
          method: 'POST',
          body: {
            email: formData.email,
            recaptcha_response: token,
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
      toaster.error({
        title: 'Error',
        description: getErrorObjPayload<{ message: string }>(error)?.message || getErrorMessage(error) || 'Something went wrong',
      });
    }
  }, [ recaptcha, apiFetch, isAuth, onSubmit, mixpanelConfig?.account_link_info.source ]);

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ formApi.handleSubmit(onFormSubmit) }
      >
        <Text>Account email, used for transaction notifications from your watchlist.</Text>
        <FormFieldEmail<EmailFormFields>
          name="email"
          required
          placeholder="Email"
          bgColor="dialog.bg"
          mt={ 6 }
        />
        <Button
          mt={ 6 }
          type="submit"
          disabled={ formApi.formState.isSubmitting }
          loading={ formApi.formState.isSubmitting }
          loadingText="Send a code"
        >
          Send a code
        </Button>
        <ReCaptcha ref={ recaptcha.ref }/>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(AuthModalScreenEmail);
