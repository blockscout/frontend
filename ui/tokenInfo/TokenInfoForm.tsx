import { Button, Grid, GridItem, Text } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import type { Fields } from './types';
import type { TokenInfoApplication } from 'types/api/account';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import useApiQuery from 'lib/api/useApiQuery';
import useToast from 'lib/hooks/useToast';
import useUpdateEffect from 'lib/hooks/useUpdateEffect';
import * as mixpanel from 'lib/mixpanel/index';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import FormFieldAddress from 'ui/shared/forms/fields/FormFieldAddress';
import FormFieldEmail from 'ui/shared/forms/fields/FormFieldEmail';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';
import FormFieldUrl from 'ui/shared/forms/fields/FormFieldUrl';
import { noWhitespaceValidator } from 'ui/shared/forms/validators/text';

import TokenInfoFieldIconUrl from './fields/TokenInfoFieldIconUrl';
import TokenInfoFieldProjectSector from './fields/TokenInfoFieldProjectSector';
import TokenInfoFieldSocialLink from './fields/TokenInfoFieldSocialLink';
import TokenInfoFieldSupport from './fields/TokenInfoFieldSupport';
import TokenInfoFormSectionHeader from './TokenInfoFormSectionHeader';
import TokenInfoFormStatusText from './TokenInfoFormStatusText';
import { getFormDefaultValues, prepareRequestBody } from './utils';

interface Props {
  address: string;
  tokenName: string;
  application?: TokenInfoApplication;
  onSubmit: (application: TokenInfoApplication) => void;
}

const TokenInfoForm = ({ address, tokenName, application, onSubmit }: Props) => {

  const containerRef = React.useRef<HTMLFormElement>(null);
  const openEventSent = React.useRef<boolean>(false);

  const apiFetch = useApiFetch();
  const toast = useToast();

  const configQuery = useApiQuery('token_info_applications_config', {
    pathParams: { chainId: config.chain.id },
  });

  const formApi = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: getFormDefaultValues(address, tokenName, application),
  });
  const { handleSubmit, formState } = formApi;

  React.useEffect(() => {
    if (!application?.id && !openEventSent.current) {
      mixpanel.logEvent(mixpanel.EventTypes.VERIFY_TOKEN, { Action: 'Form opened' });
      openEventSent.current = true;
    }
  }, [ application?.id ]);

  const onFormSubmit: SubmitHandler<Fields> = React.useCallback(async(data) => {
    try {
      const submission = prepareRequestBody(data);
      const isNewApplication = !application?.id || [ 'REJECTED', 'APPROVED' ].includes(application.status);

      const result = await apiFetch<'token_info_applications', TokenInfoApplication, { message: string }>('token_info_applications', {
        pathParams: { chainId: config.chain.id, id: !isNewApplication ? application.id : undefined },
        fetchParams: {
          method: isNewApplication ? 'POST' : 'PUT',
          body: { submission },
        },
      });

      if ('id' in result) {
        onSubmit(result);

        if (!application?.id) {
          mixpanel.logEvent(mixpanel.EventTypes.VERIFY_TOKEN, { Action: 'Submit' });
        }

      } else {
        throw result;
      }
    } catch (error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (error as ResourceError<{ message: string }>)?.payload?.message || 'Something went wrong. Try again later.',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [ apiFetch, application?.id, application?.status, onSubmit, toast ]);

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
    return <DataFetchAlert/>;
  }

  if (configQuery.isPending) {
    return <ContentLoader/>;
  }

  const fieldProps = {
    size: { base: 'md', lg: 'lg' },
    isReadOnly: application?.status === 'IN_PROCESS',
  };

  return (
    <FormProvider { ...formApi }>
      <form noValidate onSubmit={ handleSubmit(onFormSubmit) } autoComplete="off" ref={ containerRef }>
        <TokenInfoFormStatusText application={ application }/>
        <Grid mt={ 8 } gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} columnGap={ 5 } rowGap={ 5 }>

          <FormFieldText<Fields> name="token_name" isRequired placeholder="Token name" { ...fieldProps } isReadOnly/>
          <FormFieldAddress<Fields> name="address" isRequired placeholder="Token contract address" { ...fieldProps } isReadOnly/>
          <FormFieldText<Fields> name="requester_name" isRequired placeholder="Requester name" { ...fieldProps }/>
          <FormFieldEmail<Fields> name="requester_email" isRequired placeholder="Requester email" { ...fieldProps }/>

          <TokenInfoFormSectionHeader>Project info</TokenInfoFormSectionHeader>
          <FormFieldText<Fields> name="project_name" placeholder="Project name" { ...fieldProps } rules={ nonWhitespaceFieldRules }/>
          <TokenInfoFieldProjectSector { ...fieldProps } config={ configQuery.data.projectSectors }/>
          <FormFieldEmail<Fields> name="project_email" isRequired placeholder="Official project email address" { ...fieldProps }/>
          <FormFieldUrl<Fields> name="project_website" isRequired placeholder="Official project website" { ...fieldProps }/>
          <FormFieldUrl<Fields> name="docs" placeholder="Docs" { ...fieldProps }/>
          <TokenInfoFieldSupport { ...fieldProps }/>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <TokenInfoFieldIconUrl { ...fieldProps }/>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <FormFieldText<Fields>
              name="project_description"
              isRequired
              placeholder="Project description"
              maxH="160px"
              rules={{ maxLength: 300, ...nonWhitespaceFieldRules }}
              asComponent="Textarea"
              { ...fieldProps }
            />
            <Text variant="secondary" fontSize="sm" mt={ 1 }>
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
        </Grid>
        <Button
          type="submit"
          size="lg"
          mt={ 8 }
          isLoading={ formState.isSubmitting }
          loadingText="Send request"
          isDisabled={ application?.status === 'IN_PROCESS' }
        >
          Send request
        </Button>
      </form>
    </FormProvider>
  );
};

export default React.memo(TokenInfoForm);
