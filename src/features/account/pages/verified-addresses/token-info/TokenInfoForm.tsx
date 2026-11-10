// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid, GridItem, Text } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { Fields } from './types';
import * as adminRs from '@blockscout/admin-rs-types';

import useApiFetch from 'src/api/hooks/useApiFetch';
import useApiQuery from 'src/api/hooks/useApiQuery';
import type { ResourceError } from 'src/api/resources';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';
import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import * as analytics from 'src/shared/analytics';

import { Button } from 'src/toolkit/chakra/button';
import { toaster } from 'src/toolkit/chakra/toaster';
import { FormFieldAddress } from 'src/toolkit/components/forms/fields/FormFieldAddress';
import { FormFieldEmail } from 'src/toolkit/components/forms/fields/FormFieldEmail';
import { FormFieldText } from 'src/toolkit/components/forms/fields/FormFieldText';
import { FormFieldUrl } from 'src/toolkit/components/forms/fields/FormFieldUrl';
import { noWhitespaceValidator } from 'src/toolkit/components/forms/validators/text';
import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';
import { useUpdateEffect } from 'src/toolkit/hooks/useUpdateEffect';

import TokenInfoFieldIconUrl from './fields/TokenInfoFieldIconUrl';
import TokenInfoFieldProjectSector from './fields/TokenInfoFieldProjectSector';
import TokenInfoFieldSocialLink from './fields/TokenInfoFieldSocialLink';
import TokenInfoFieldSupport from './fields/TokenInfoFieldSupport';
import TokenInfoExpeditedReview from './TokenInfoExpeditedReview';
import TokenInfoFormSectionHeader from './TokenInfoFormSectionHeader';
import TokenInfoFormStatusText from './TokenInfoFormStatusText';
import { getFormDefaultValues, prepareRequestBody } from './utils';

interface Props {
  address: string;
  tokenName: string;
  application?: adminRs.TokenInfoSubmission;
  onSubmit: (application: adminRs.TokenInfoSubmission) => void;
}

const TokenInfoForm = ({ address, tokenName, application, onSubmit }: Props) => {

  const containerRef = React.useRef<HTMLFormElement>(null);
  const openEventSent = React.useRef<boolean>(false);

  const apiFetch = useApiFetch();

  const configQuery = useApiQuery('admin:token_info_applications_config', {
    pathParams: { instanceId: config.apis.admin?.instanceId },
  });

  const formApi = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: getFormDefaultValues(address, tokenName, application),
  });
  const { handleSubmit, formState } = formApi;

  React.useEffect(() => {
    if (!application?.id && !openEventSent.current) {
      analytics.logEvent(analytics.EventTypes.VERIFY_TOKEN, { Action: 'Form opened' });
      openEventSent.current = true;
    }
  }, [ application?.id ]);

  const expeditedReviewHtml = getFeaturePayload(config.features.account)?.verifiedAddresses?.expeditedReviewHtml;
  const isInProcess = application?.status === adminRs.TokenInfoSubmissionStatus.IN_PROCESS;
  // An application under review is read-only, except that the payment tx hash can be set once (the API rejects a change).
  const canUpdatePaymentTx = Boolean(isInProcess && expeditedReviewHtml && application && !application.paymentTx);

  const onFormSubmit: SubmitHandler<Fields> = React.useCallback(async(data) => {
    try {
      const result = await (async() => {
        if (canUpdatePaymentTx && application?.id) {
          return apiFetch<'admin:token_info_application_payment_tx', adminRs.TokenInfoSubmission, { message: string }>(
            'admin:token_info_application_payment_tx',
            {
              pathParams: { instanceId: config.apis.admin?.instanceId, id: application.id },
              fetchParams: {
                method: 'PATCH',
                body: { paymentTx: data.payment_tx },
              },
            },
          );
        }

        const submission = prepareRequestBody(data);
        const isNewApplication = !application?.id || [
          adminRs.TokenInfoSubmissionStatus.REJECTED,
          adminRs.TokenInfoSubmissionStatus.APPROVED,
        ].includes(application.status);

        return apiFetch<'admin:token_info_applications', adminRs.TokenInfoSubmission, { message: string }>('admin:token_info_applications', {
          pathParams: { instanceId: config.apis.admin?.instanceId, id: !isNewApplication ? application.id : undefined },
          fetchParams: {
            method: isNewApplication ? 'POST' : 'PUT',
            body: { submission },
          },
        });
      })();

      if ('id' in result) {
        onSubmit(result);

        if (!application?.id) {
          analytics.logEvent(analytics.EventTypes.VERIFY_TOKEN, { Action: 'Submit' });
        }

      } else {
        throw result;
      }
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: (error as ResourceError<{ message: string }>)?.payload?.message || 'Something went wrong. Try again later.',
      });
    }
  }, [ apiFetch, application?.id, application?.status, canUpdatePaymentTx, onSubmit ]);

  useUpdateEffect(() => {
    if (formState.submitCount > 0 && !formState.isValid) {
      containerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ formState.isValid, formState.submitCount ]);

  const nonWhitespaceFieldRules = React.useMemo(() => {
    return {
      validate: {
        no_whitespace: noWhitespaceValidator,
      },
    };
  }, []);

  if (configQuery.isError) {
    return <ApiFetchAlert/>;
  }

  if (configQuery.isPending) {
    return <ContentLoader/>;
  }

  const fieldProps = {
    readOnly: isInProcess,
  };
  const submitButtonText = canUpdatePaymentTx ? 'Update request' : 'Send request';

  return (
    <FormProvider { ...formApi }>
      <form noValidate onSubmit={ handleSubmit(onFormSubmit) } autoComplete="off" ref={ containerRef }>
        <TokenInfoFormStatusText application={ application }/>
        <Grid mt={ 8 } gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} columnGap={ 5 } rowGap={ 5 }>

          <FormFieldText<Fields> name="token_name" required placeholder="Token name" { ...fieldProps } readOnly/>
          <FormFieldAddress<Fields> name="address" required placeholder="Token contract address" { ...fieldProps } readOnly/>
          <FormFieldText<Fields> name="requester_name" required placeholder="Requester name" { ...fieldProps }/>
          <FormFieldEmail<Fields> name="requester_email" required placeholder="Requester email" { ...fieldProps }/>

          <TokenInfoFormSectionHeader>Project info</TokenInfoFormSectionHeader>
          <FormFieldText<Fields> name="project_name" placeholder="Project name" { ...fieldProps } rules={ nonWhitespaceFieldRules }/>
          <TokenInfoFieldProjectSector { ...fieldProps } config={ configQuery.data.projectSectors }/>
          <FormFieldEmail<Fields> name="project_email" required placeholder="Official project email address" { ...fieldProps }/>
          <FormFieldUrl<Fields> name="project_website" required placeholder="Official project website" { ...fieldProps }/>
          <FormFieldUrl<Fields> name="docs" placeholder="Docs" { ...fieldProps }/>
          <TokenInfoFieldSupport { ...fieldProps }/>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <TokenInfoFieldIconUrl { ...fieldProps }/>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <FormFieldText<Fields>
              name="project_description"
              required
              placeholder="Project description"
              maxH="160px"
              rules={{ maxLength: 300, ...nonWhitespaceFieldRules }}
              asComponent="Textarea"
              { ...fieldProps }
            />
            <Text color="text.secondary" fontSize="sm" mt={ 1 }>
              Introduce or summarize the project’s operation/goals in a maximum of 300 characters.
              The description should be written in a neutral point of view and must exclude unsubstantiated claims unless proven otherwise.
            </Text>
          </GridItem>

          <TokenInfoFormSectionHeader>Links</TokenInfoFormSectionHeader>
          <TokenInfoFieldSocialLink { ...fieldProps } name="github"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="twitter"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="telegram"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="opensea"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="linkedin"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="facebook"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="discord"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="medium"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="slack"/>
          <TokenInfoFieldSocialLink { ...fieldProps } name="reddit"/>

          <TokenInfoFormSectionHeader>Price data</TokenInfoFormSectionHeader>
          <FormFieldUrl<Fields> name="ticker_coin_market_cap" placeholder="CoinMarketCap URL" { ...fieldProps }/>
          <FormFieldUrl<Fields> name="ticker_coin_gecko" placeholder="CoinGecko URL" { ...fieldProps }/>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <FormFieldUrl<Fields> name="ticker_defi_llama" placeholder="DefiLlama URL" { ...fieldProps }/>
          </GridItem>

          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <FormFieldText<Fields>
              name="comment"
              placeholder="Comment"
              maxH="160px"
              rules={{ maxLength: 300 }}
              asComponent="Textarea"
              { ...fieldProps }
            />
          </GridItem>

          { expeditedReviewHtml && (
            <TokenInfoExpeditedReview
              html={ expeditedReviewHtml }
              readOnly={ fieldProps.readOnly && !canUpdatePaymentTx }
              required={ canUpdatePaymentTx }
            />
          ) }
        </Grid>
        <Button
          type="submit"
          mt={ 8 }
          loading={ formState.isSubmitting }
          loadingText={ submitButtonText }
          disabled={ isInProcess && !canUpdatePaymentTx }
        >
          { submitButtonText }
        </Button>
      </form>
    </FormProvider>
  );
};

export default React.memo(TokenInfoForm);
