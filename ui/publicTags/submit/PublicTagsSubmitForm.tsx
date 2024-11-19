import { Button, chakra, Grid, GridItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { FormFields, FormSubmitResult } from './types';
import type { UserInfo } from 'types/api/account';
import type { PublicTagTypesResponse } from 'types/api/addressMetadata';

import appConfig from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorObj from 'lib/errors/getErrorObj';
import getErrorObjPayload from 'lib/errors/getErrorObjPayload';
import useIsMobile from 'lib/hooks/useIsMobile';
import FormFieldEmail from 'ui/shared/forms/fields/FormFieldEmail';
import FormFieldReCaptcha from 'ui/shared/forms/fields/FormFieldReCaptcha';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';
import FormFieldUrl from 'ui/shared/forms/fields/FormFieldUrl';
import Hint from 'ui/shared/Hint';

import PublicTagsSubmitFieldAddresses from './fields/PublicTagsSubmitFieldAddresses';
import PublicTagsSubmitFieldTags from './fields/PublicTagsSubmitFieldTags';
import { convertFormDataToRequestsBody, getFormDefaultValues } from './utils';

interface Props {
  config?: PublicTagTypesResponse | undefined;
  userInfo?: UserInfo | undefined;
  onSubmitResult: (result: FormSubmitResult) => void;
}

const PublicTagsSubmitForm = ({ config, userInfo, onSubmitResult }: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const apiFetch = useApiFetch();

  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: getFormDefaultValues(router.query, userInfo),
  });

  React.useEffect(() => {
    if (
      router.query.addresses ||
      router.query.requesterName ||
      router.query.requesterEmail ||
      router.query.companyName ||
      router.query.companyWebsite
    ) {
      router.replace({ pathname: '/public-tags/submit' }, undefined, { shallow: true });
    }
  }, [ router ]);

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(data) => {
    const requestsBody = convertFormDataToRequestsBody(data);

    const result = await Promise.all(requestsBody.map(async(body) => {
      return apiFetch<'public_tag_application', unknown, { message: string }>('public_tag_application', {
        pathParams: { chainId: appConfig.chain.id },
        fetchParams: {
          method: 'POST',
          body: { submission: body },
        },
      })
        .then(() => ({ error: null, payload: body }))
        .catch((error: unknown) => {
          const errorObj = getErrorObj(error);
          const messageFromPayload = getErrorObjPayload<{ message?: string }>(errorObj)?.message;
          const messageFromError = errorObj && 'message' in errorObj && typeof errorObj.message === 'string' ? errorObj.message : undefined;
          const message = messageFromPayload || messageFromError || 'Something went wrong.';
          return { error: message, payload: body };
        });
    }));

    onSubmitResult(result);
  }, [ apiFetch, onSubmitResult ]);

  if (!appConfig.services.reCaptchaV3.siteKey) {
    return null;
  }

  const fieldProps = {
    size: { base: 'md', lg: 'lg' },
  };

  return (
    <GoogleReCaptchaProvider reCaptchaKey={ appConfig.services.reCaptchaV3.siteKey }>
      <FormProvider { ...formApi }>
        <chakra.form
          noValidate
          onSubmit={ formApi.handleSubmit(onFormSubmit) }
        >
          <Grid
            columnGap={ 3 }
            rowGap={ 3 }
            templateColumns={{ base: '1fr', lg: '1fr 1fr minmax(0, 200px)', xl: '1fr 1fr minmax(0, 250px)' }}
          >
            <GridItem colSpan={{ base: 1, lg: 3 }} as="h2" textStyle="h4">
              Company info
            </GridItem>
            <FormFieldText<FormFields> name="requesterName" isRequired placeholder="Your name" { ...fieldProps }/>
            <FormFieldEmail<FormFields> name="requesterEmail" isRequired { ...fieldProps }/>

            { !isMobile && <div/> }
            <FormFieldText<FormFields> name="companyName" placeholder="Company name" { ...fieldProps }/>
            <FormFieldUrl<FormFields> name="companyWebsite" placeholder="Company website" { ...fieldProps }/>
            { !isMobile && <div/> }

            <GridItem colSpan={{ base: 1, lg: 3 }} as="h2" textStyle="h4" mt={{ base: 3, lg: 5 }}>
              Public tags/labels
              <Hint label="Submit a public tag proposal for our moderation team to review" ml={ 1 } color="link"/>
            </GridItem>
            <PublicTagsSubmitFieldAddresses/>
            <PublicTagsSubmitFieldTags tagTypes={ config?.tagTypes }/>
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <FormFieldText<FormFields>
                name="description"
                isRequired
                placeholder={
                  isMobile ?
                    'Confirm the connection between addresses and tags.' :
                    'Provide a comment to confirm the connection between addresses and tags.'
                }
                maxH="160px"
                rules={{ maxLength: 80 }}
                asComponent="Textarea"
                { ...fieldProps }
              />
            </GridItem>

            <GridItem colSpan={{ base: 1, lg: 3 }}>
              <FormFieldReCaptcha/>
            </GridItem>

            <Button
              variant="solid"
              size="lg"
              type="submit"
              mt={ 3 }
              isLoading={ formApi.formState.isSubmitting }
              loadingText="Send request"
              w="min-content"
            >
              Send request
            </Button>
          </Grid>
        </chakra.form>
      </FormProvider>
    </GoogleReCaptchaProvider>
  );
};

export default React.memo(PublicTagsSubmitForm);
