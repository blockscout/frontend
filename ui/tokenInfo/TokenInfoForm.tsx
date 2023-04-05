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
import TokenInfoFieldProjectDescription from './fields/TokenInfoFieldProjectDescription';
import TokenInfoFieldProjectEmail from './fields/TokenInfoFieldProjectEmail';
import TokenInfoFieldProjectName from './fields/TokenInfoFieldProjectName';
import TokenInfoFieldProjectSector from './fields/TokenInfoFieldProjectSector';
import TokenInfoFieldProjectWebsite from './fields/TokenInfoFieldProjectWebsite';
import TokenInfoFieldRequesterEmail from './fields/TokenInfoFieldRequesterEmail';
import TokenInfoFieldRequesterName from './fields/TokenInfoFieldRequesterName';
import TokenInfoFieldSupport from './fields/TokenInfoFieldSupport';
import TokenInfoFormSectionHeader from './TokenInfoFormSectionHeader';

interface Props {
  id: number;
}

const TokenInfoForm = ({ id }: Props) => {

  const configQuery = useApiQuery('token_info_application_config', {
    pathParams: { chainId: appConfig.network.id },
  });

  const formApi = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: {
      address: '0x9d2a7b2b09b1d4786e36699d9f56b8c04e92cbb9',
    },
  });
  const { handleSubmit, formState, control } = formApi;

  const onFormSubmit: SubmitHandler<Fields> = React.useCallback(async(data) => {
    // eslint-disable-next-line no-console
    console.log('__>__', id, data);
  }, [ id ]);

  const onSubmit = handleSubmit(onFormSubmit);

  if (configQuery.isError) {
    return <DataFetchAlert/>;
  }

  if (configQuery.isLoading) {
    return <ContentLoader/>;
  }

  const fieldProps = { control, formState };

  return (
    <form noValidate onSubmit={ onSubmit }>
      <div>Requests are sent to a moderator for review and approval. This process can take several days.</div>
      <Grid mt={ 8 } gridTemplateColumns="1fr 1fr" columnGap={ 5 } rowGap={ 5 }>
        <GridItem colSpan={ 2 }><TokenInfoFieldAddress { ...fieldProps }/></GridItem>
        <TokenInfoFieldRequesterName { ...fieldProps }/>
        <TokenInfoFieldRequesterEmail { ...fieldProps }/>
        <TokenInfoFormSectionHeader>Project info</TokenInfoFormSectionHeader>
        <TokenInfoFieldProjectName { ...fieldProps }/>
        <TokenInfoFieldProjectSector { ...fieldProps } config={ configQuery.data.projectSectors }/>
        <TokenInfoFieldProjectEmail { ...fieldProps }/>
        <TokenInfoFieldProjectWebsite { ...fieldProps }/>
        <TokenInfoFieldDocs { ...fieldProps }/>
        <TokenInfoFieldSupport { ...fieldProps }/>
        <GridItem colSpan={ 2 }><TokenInfoFieldIconUrl { ...fieldProps }/></GridItem>
        <GridItem colSpan={ 2 }><TokenInfoFieldProjectDescription { ...fieldProps }/></GridItem>
      </Grid>
      <Button type="submit" size="lg" mt={ 8 }>Send request</Button>
    </form>
  );
};

export default React.memo(TokenInfoForm);
