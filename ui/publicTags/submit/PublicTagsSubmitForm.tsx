import { Button, chakra, Grid, GridItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { FormFields, FormSubmitResult } from './types';
import type { PublicTagTypesResponse } from 'types/api/addressMetadata';

import delay from 'lib/delay';
import useIsMobile from 'lib/hooks/useIsMobile';
import FormFieldReCaptcha from 'ui/shared/forms/fields/FormFieldReCaptcha';
import Hint from 'ui/shared/Hint';

import PublicTagsSubmitFieldAddresses from './fields/PublicTagsSubmitFieldAddresses';
import PublicTagsSubmitFieldCompanyName from './fields/PublicTagsSubmitFieldCompanyName';
import PublicTagsSubmitFieldCompanyWebsite from './fields/PublicTagsSubmitFieldCompanyWebsite';
import PublicTagsSubmitFieldDescription from './fields/PublicTagsSubmitFieldDescription';
import PublicTagsSubmitFieldRequesterEmail from './fields/PublicTagsSubmitFieldRequesterEmail';
import PublicTagsSubmitFieldRequesterName from './fields/PublicTagsSubmitFieldRequesterName';
import PublicTagsSubmitFieldTags from './fields/PublicTagsSubmitFieldTags';
import * as mocks from './mocks';
import { getDefaultValuesFromQuery } from './utils';

interface Props {
  config: PublicTagTypesResponse | undefined;
  onSubmitResult: (result: FormSubmitResult) => void;
}

const PublicTagsSubmitForm = ({ config, onSubmitResult }: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();

  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: getDefaultValuesFromQuery(router.query),
  });

  React.useEffect(() => {
    if (
      router.query.addresses ||
      router.query.requesterName ||
      router.query.requesterEmail ||
      router.query.companyName ||
      router.query.companyWebsite
    ) {
      router.push({ pathname: '/public-tags/submit' }, undefined, { shallow: true });
    }
  }, [ router.query.addresses, router ]);

  const handleMockClick = React.useCallback(async() => {
    return onSubmitResult(mocks.mixedResponses);
  }, [ onSubmitResult ]);

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(data) => {
    // eslint-disable-next-line no-console
    console.log('__>__', data, config);

    await delay(1000);
    onSubmitResult([
      { error: null, payload: data },
    ]);
  }, [ config, onSubmitResult ]);

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ formApi.handleSubmit(onFormSubmit) }
      >
        <Grid
          columnGap={ 5 }
          rowGap={{ base: 5, lg: 4 }}
          templateColumns={{ base: '1fr', lg: '1fr 1fr minmax(0, 200px)', xl: '1fr 1fr minmax(0, 250px)' }}
        >
          <GridItem colSpan={{ base: 1, lg: 3 }} as="h2" textStyle="h4">
            Company info
          </GridItem>
          <PublicTagsSubmitFieldRequesterName/>
          <PublicTagsSubmitFieldCompanyName/>
          { !isMobile && <div/> }
          <PublicTagsSubmitFieldRequesterEmail/>
          <PublicTagsSubmitFieldCompanyWebsite/>
          { !isMobile && <div/> }

          <GridItem colSpan={{ base: 1, lg: 3 }} as="h2" textStyle="h4" mt={ 3 }>
            Public tags/labels
            <Hint label="Submit a public tag proposal for our moderation team to review" ml={ 1 } color="link"/>
          </GridItem>
          <PublicTagsSubmitFieldAddresses/>
          <PublicTagsSubmitFieldTags tagTypes={ config?.tagTypes }/>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <PublicTagsSubmitFieldDescription/>
          </GridItem>

          <GridItem colSpan={{ base: 1, lg: 3 }}>
            <FormFieldReCaptcha/>
          </GridItem>

          <Button
            variant="solid"
            size="lg"
            type="submit"
            mt={ 3 }
            isDisabled={ !formApi.formState.isValid }
            isLoading={ formApi.formState.isSubmitting }
            loadingText="Send request"
            w="min-content"
          >
            Send request
          </Button>
          <Button
            onClick={ handleMockClick }
            size="lg"
            mt={ 3 }
            colorScheme="gray"
            w="min-content"
          >
            Mock
          </Button>
        </Grid>
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(PublicTagsSubmitForm);
