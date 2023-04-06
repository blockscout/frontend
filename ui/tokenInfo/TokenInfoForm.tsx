import { Button, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { Fields } from './types';

import appConfig from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TokenInfoFieldAddress from './fields/TokenInfoFieldAddress';
import TokenInfoFieldDocs from './fields/TokenInfoFieldDocs';
import TokenInfoFieldIconUrl from './fields/TokenInfoFieldIconUrl';
import TokenInfoFieldPriceTicker from './fields/TokenInfoFieldPriceTicker';
import TokenInfoFieldProjectDescription from './fields/TokenInfoFieldProjectDescription';
import TokenInfoFieldProjectEmail from './fields/TokenInfoFieldProjectEmail';
import TokenInfoFieldProjectName from './fields/TokenInfoFieldProjectName';
import TokenInfoFieldProjectSector from './fields/TokenInfoFieldProjectSector';
import TokenInfoFieldProjectWebsite from './fields/TokenInfoFieldProjectWebsite';
import TokenInfoFieldRequesterEmail from './fields/TokenInfoFieldRequesterEmail';
import TokenInfoFieldRequesterName from './fields/TokenInfoFieldRequesterName';
import TokenInfoFieldSocialLink from './fields/TokenInfoFieldSocialLink';
import TokenInfoFieldSupport from './fields/TokenInfoFieldSupport';
import TokenInfoFormSectionHeader from './TokenInfoFormSectionHeader';

interface Props {
  address: string;
}

const TokenInfoForm = ({ address }: Props) => {

  const configQuery = useApiQuery('token_info_application_config', {
    pathParams: { chainId: appConfig.network.id },
  });

  const formApi = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: {
      address,
    },
  });
  const { handleSubmit, formState, control, trigger } = formApi;

  const onFormSubmit: SubmitHandler<Fields> = React.useCallback(async(data) => {
    // eslint-disable-next-line no-console
    console.log('__>__', data);
  }, [ ]);

  const onSubmit = handleSubmit(onFormSubmit);

  if (configQuery.isError) {
    return <DataFetchAlert/>;
  }

  if (configQuery.isLoading) {
    return <ContentLoader/>;
  }

  const fieldProps = { control };

  return (
    <form noValidate onSubmit={ onSubmit }>
      <div>Requests are sent to a moderator for review and approval. This process can take several days.</div>
      <Grid mt={ 8 } gridTemplateColumns="1fr 1fr" columnGap={ 5 } rowGap={ 5 }>

        <GridItem colSpan={ 2 }>
          <TokenInfoFieldAddress { ...fieldProps }/>
        </GridItem>
        <TokenInfoFieldRequesterName { ...fieldProps }/>
        <TokenInfoFieldRequesterEmail { ...fieldProps }/>

        <TokenInfoFormSectionHeader>Project info</TokenInfoFormSectionHeader>
        <TokenInfoFieldProjectName { ...fieldProps }/>
        <TokenInfoFieldProjectSector { ...fieldProps } config={ configQuery.data.projectSectors }/>
        <TokenInfoFieldProjectEmail { ...fieldProps }/>
        <TokenInfoFieldProjectWebsite { ...fieldProps }/>
        <TokenInfoFieldDocs { ...fieldProps }/>
        <TokenInfoFieldSupport { ...fieldProps }/>
        <GridItem colSpan={ 2 }>
          <TokenInfoFieldIconUrl { ...fieldProps } trigger={ trigger }/>
        </GridItem>
        <GridItem colSpan={ 2 }>
          <TokenInfoFieldProjectDescription { ...fieldProps }/>
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
        <TokenInfoFieldPriceTicker { ...fieldProps } name="ticker_coin_market_cap" label="CoinMarketCap URL"/>
        <TokenInfoFieldPriceTicker { ...fieldProps } name="ticker_coin_gecko" label="CoinGecko URL"/>
        <GridItem colSpan={ 2 }>
          <TokenInfoFieldPriceTicker { ...fieldProps } name="ticker_defi_llama" label="DefiLlama URL "/>
        </GridItem>
      </Grid>
      <Button
        type="submit"
        size="lg"
        mt={ 8 }
        isLoading={ formState.isSubmitting }
        loadingText="Send request"
      >
        Send request
      </Button>
    </form>
  );
};

export default React.memo(TokenInfoForm);
