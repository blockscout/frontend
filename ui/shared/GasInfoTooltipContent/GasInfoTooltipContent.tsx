import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { HomeStats } from 'types/api/stats';

import dayjs from 'lib/date/dayjs';

import GasInfoRow from './GasInfoRow';
import GasInfoUpdateTimer from './GasInfoUpdateTimer';

interface Props {
  data: HomeStats;
}

const GasInfoTooltipContent = ({ data }: Props) => {

  if (!data.gas_prices) {
    return null;
  }

  return (
    <Grid templateColumns="repeat(2, max-content)" rowGap={ 2 } columnGap={ 4 } padding={ 4 } fontSize="xs" lineHeight={ 4 }>
      { data.gas_price_updated_at && (
        <>
          <GridItem color="text_secondary">Last update</GridItem>
          <GridItem color="text_secondary" display="flex" justifyContent="flex-end" columnGap={ 2 }>
            { dayjs(data.gas_price_updated_at).format('MMM DD, HH:mm:ss') }
            { data.gas_prices_update_in !== 0 &&
              <GasInfoUpdateTimer startTime={ data.gas_price_updated_at } duration={ data.gas_prices_update_in }/> }
          </GridItem>
        </>
      ) }
      <GasInfoRow name="Slow" info={ data.gas_prices.slow }/>
      <GasInfoRow name="Average" info={ data.gas_prices.average }/>
      <GasInfoRow name="Fast" info={ data.gas_prices.fast }/>
    </Grid>
  );
};

export default React.memo(GasInfoTooltipContent);
