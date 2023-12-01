import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { GasPrices } from 'types/api/stats';

const StatsGasPrices = ({ gasPrices }: {gasPrices: GasPrices}) => {
  const labelStyleProps = {
    color: 'accent',
  };
  const contentStyleProps = {
    color: 'white',
  };

  return (
    <Grid templateColumns="repeat(2, max-content)" rowGap={ 2 } columnGap={ 4 } padding={ 4 } fontSize="xs">
      <GridItem { ...labelStyleProps }>Slow</GridItem>
      <GridItem { ...contentStyleProps }>{ `${ gasPrices.slow } Gacanto` }</GridItem>
      <GridItem { ...labelStyleProps }>Average</GridItem>
      <GridItem { ...contentStyleProps }>{ `${ gasPrices.average } Gacanto` }</GridItem>
      <GridItem { ...labelStyleProps }>Fast</GridItem>
      <GridItem { ...contentStyleProps }>{ `${ gasPrices.fast } Gacanto` }</GridItem>
    </Grid>
  );
};

export default StatsGasPrices;
