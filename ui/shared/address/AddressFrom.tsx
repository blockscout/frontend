import { Grid, chakra } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import type { EntityProps } from 'ui/shared/entities/address/AddressEntity';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityWithTokenFilter from 'ui/shared/entities/address/AddressEntityWithTokenFilter';

interface Props {
  from: AddressParam;
  current?: string;
  className?: string;
  isLoading?: boolean;
  tokenHash?: string;
  truncation?: EntityProps['truncation'];
  noIcon?: boolean;
}

const AddressFrom = ({
  from,
  current,
  className,
  isLoading,
  tokenHash = '',
  noIcon,
}: Props) => {
  const Entity = tokenHash ? AddressEntityWithTokenFilter : AddressEntity;

  const isOutgoing = current === from.hash;
  const iconSize = 20;

  return (
    <Grid
      className={ className }
      alignItems="center"
      gridTemplateColumns={ `fit-content(100%) ${ iconSize }px fit-content(100%)` }
    >
      <Entity
        address={ from }
        isLoading={ isLoading }
        noLink={ isOutgoing }
        noCopy={ isOutgoing }
        noIcon={ noIcon }
        tokenHash={ tokenHash }
        truncation="constant"
        mr={ isOutgoing ? 4 : 2 }
      />
    </Grid>
  );
};

export default chakra(AddressFrom);
