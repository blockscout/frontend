import { Grid, chakra } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityWithTokenFilter from 'ui/shared/entities/address/AddressEntityWithTokenFilter';

import AddressFromToIcon from './AddressFromToIcon';

interface Props {
  from: AddressParam;
  to: AddressParam | null;
  isLoading?: boolean;
  tokenHash?: string;
}

const AddressTo = ({ to, isLoading, tokenHash = '' }: Props) => {
  const Entity = tokenHash ? AddressEntityWithTokenFilter : AddressEntity;

  const iconSize = 20;

  return (
    <Grid
      alignItems="center"
      gridTemplateColumns={ `fit-content(100%) ${ iconSize }px fit-content(100%)` }
    >
      <AddressFromToIcon isLoading={ isLoading }/>
      <Entity
        address={ to }
        isLoading={ isLoading }
        tokenHash={ tokenHash }
        truncation="constant"
        ml={ 3 }
      />
    </Grid>
  );
};

export default chakra(AddressTo);
