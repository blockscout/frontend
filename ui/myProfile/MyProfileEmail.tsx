import { chakra } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { FormFields } from './types';
import type { UserInfo, UserInfoErrors } from 'types/api/account';

import config from 'configs/app';
import type { ResourceErrorAccount } from 'lib/api/resources';
import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/errors/getErrorMessage';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import getFieldErrorMessage from 'lib/getErrorMessage';
import * as mixpanel from 'lib/mixpanel';
import { Button } from 'toolkit/chakra/button';
import { Heading } from 'toolkit/chakra/heading';
import { toaster } from 'toolkit/chakra/toaster';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';
import AuthModal from 'ui/snippets/auth/AuthModal';

import MyProfileFieldsEmail from './fields/MyProfileFieldsEmail';

const MIXPANEL_CONFIG = {
  account_link_info: {
    source: 'Profile' as const,
  },
};

const NAME_MAX_LENGTH = 255;

const getProfileFormValues = (profile: UserInfo | undefined): FormFields => ({
  email: profile?.email || '',
  name: profile?.name || profile?.nickname || '',
});

interface Props {
  profileQuery: UseQueryResult<UserInfo, unknown>;
}

const MyProfileEmail = ({ profileQuery }: Props) => {
  const authModal = useDisclosure();
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();
  const recaptcha = useReCaptcha();
  const profileFormValues = React.useMemo(() => getProfileFormValues(profileQuery.data), [ profileQuery.data ]);

  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: profileFormValues,
  });

  React.useEffect(() => {
    if (!formApi.formState.isDirty) {
      formApi.reset(profileFormValues);
    }
  }, [ formApi, formApi.formState.isDirty, profileFormValues ]);

  const authFetchFactory = React.useCallback((email: string) => (recaptchaToken?: string) => {
    return apiFetch('general:auth_send_otp', {
      fetchParams: {
        method: 'POST',
        body: { email, recaptcha_response: recaptchaToken },
        headers: {
          ...(recaptchaToken && { 'recaptcha-v2-response': recaptchaToken }),
        },
      },
    });
  }, [ apiFetch ]);

  const profileFetch = React.useCallback((name: string) => {
    return apiFetch<'general:user_info', UserInfo, { errors: UserInfoErrors }>('general:user_info', {
      fetchParams: {
        method: 'PUT',
        body: { name },
      },
    }) as Promise<UserInfo>;
  }, [ apiFetch ]);

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(formData) => {
    const shouldUpdateProfile = Boolean(formApi.formState.dirtyFields.name);
    const shouldSendOtp = config.services.reCaptchaV2.siteKey && !profileQuery.data?.email && Boolean(formApi.formState.dirtyFields.email);

    try {
      let updatedProfile: UserInfo | undefined;

      if (shouldUpdateProfile) {
        updatedProfile = await profileFetch(formData.name);
        queryClient.setQueryData([ resourceKey('general:user_info') ], updatedProfile);
        toaster.success({
          title: 'Profile updated',
          description: 'Your name was saved.',
        });
      }

      if (shouldSendOtp) {
        await recaptcha.fetchProtectedResource(authFetchFactory(formData.email));
        mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_LINK_INFO, {
          Source: 'Profile',
          Status: 'OTP sent',
          Type: 'Email',
        });
        authModal.onOpen();
      }

      if (updatedProfile && !shouldSendOtp) {
        formApi.reset(getProfileFormValues(updatedProfile));
      }
    } catch (error) {
      const accountApiError = error as ResourceErrorAccount<UserInfoErrors>;
      const errorMap = accountApiError.payload?.errors;

      if (errorMap?.name) {
        formApi.setError('name', { type: 'custom', message: getFieldErrorMessage(errorMap, 'name') });
        return;
      }

      const apiError = getErrorObjPayload<{ message: string }>(error);
      toaster.error({
        title: 'Error',
        description: apiError?.message || getErrorMessage(error) || 'Something went wrong',
      });
    }
  }, [ authFetchFactory, authModal, formApi, profileFetch, profileQuery.data?.email, queryClient, recaptcha ]);

  const canLinkEmail = Boolean(config.services.reCaptchaV2.siteKey && !profileQuery.data?.email);
  const hasDirtyName = Boolean(formApi.formState.dirtyFields.name);
  const hasDirtyEmail = Boolean(formApi.formState.dirtyFields.email);
  const hasSaveableChanges = hasDirtyName || (canLinkEmail && hasDirtyEmail);
  const shouldShowSaveButton = canLinkEmail || hasSaveableChanges;

  return (
    <section>
      <Heading level="2" mb={ 3 }>Notifications</Heading>
      <FormProvider { ...formApi }>
        <chakra.form
          noValidate
          onSubmit={ formApi.handleSubmit(onFormSubmit) }
        >
          <FormFieldText<FormFields>
            name="name"
            placeholder="Name"
            required
            rules={{
              maxLength: NAME_MAX_LENGTH,
            }}
            inputProps={{
              maxLength: NAME_MAX_LENGTH,
            }}
            mb={ 3 }
          />
          <MyProfileFieldsEmail
            isReadOnly={ !canLinkEmail }
            defaultValue={ profileQuery.data?.email || undefined }
          />
          { canLinkEmail && <ReCaptcha { ...recaptcha }/> }
          { shouldShowSaveButton && (
            <Button
              mt={ 6 }
              size="sm"
              variant="outline"
              type="submit"
              disabled={ formApi.formState.isSubmitting || !hasSaveableChanges || (canLinkEmail && hasDirtyEmail && recaptcha.isInitError) }
              loading={ formApi.formState.isSubmitting }
              loadingText="Save changes"
            >
              Save changes
            </Button>
          ) }
        </chakra.form>
      </FormProvider>
      { authModal.open && (
        <AuthModal
          initialScreen={{ type: 'otp_code', isAuth: true, email: formApi.getValues('email') }}
          onClose={ authModal.onClose }
          mixpanelConfig={ MIXPANEL_CONFIG }
        />
      ) }
    </section>
  );
};

export default React.memo(MyProfileEmail);
