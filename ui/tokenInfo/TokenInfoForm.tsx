import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { Fields } from './types';

import TokenInfoFieldAddress from './fields/TokenInfoFieldAddress';
import TokenInfoFieldRequesterEmail from './fields/TokenInfoFieldRequesterEmail';
import TokenInfoFieldRequesterName from './fields/TokenInfoFieldRequesterName';

interface Props {
  id: number;
}

const TokenInfoForm = ({ id }: Props) => {
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

  return (
    <form noValidate onSubmit={ onSubmit }>
      <div>Requests are sent to a moderator for review and approval. This process can take several days.</div>
      <Grid mt={ 8 } gridTemplateColumns="1fr 1fr" columnGap={ 5 } rowGap={ 5 }>
        <GridItem colSpan={ 2 }>
          <TokenInfoFieldAddress control={ control }/>
        </GridItem>
        <GridItem>
          <TokenInfoFieldRequesterName control={ control } formState={ formState }/>
        </GridItem>
        <GridItem>
          <TokenInfoFieldRequesterEmail control={ control } formState={ formState }/>
        </GridItem>
      </Grid>
    </form>
  );
};

export default TokenInfoForm;
