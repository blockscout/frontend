import { DarkMode, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { HomeStats } from 'types/api/stats';

import dayjs from 'lib/date/dayjs';

import GasInfoTooltipRow from './GasInfoTooltipRow';
import GasInfoUpdateTimer from './GasInfoUpdateTimer';

interface Props {
  data: HomeStats;
  dataUpdatedAt: number;
}

const GasInfoTooltipContent = ({ data, dataUpdatedAt }: Props) => {

  if (!data.gas_prices) {
    return null;
  }

  return (
    <DarkMode>
      <Grid templateColumns="repeat(2, max-content)" rowGap={ 2 } columnGap={ 4 } padding={ 4 } fontSize="xs" lineHeight={ 4 }>
        { data.gas_price_updated_at && (
          <>
            <GridItem color="text_secondary">Last update</GridItem>
            <GridItem color="text_secondary" display="flex" justifyContent="flex-end" columnGap={ 2 }>
              { dayjs(data.gas_price_updated_at).format('MMM DD, HH:mm:ss') }
              { data.gas_prices_update_in !== 0 &&
              <GasInfoUpdateTimer key={ dataUpdatedAt } startTime={ dataUpdatedAt } duration={ data.gas_prices_update_in }/> }
            </GridItem>
          </>
        ) }
        <GasInfoTooltipRow name="Slow" info={ data.gas_prices.slow }/>
        <GasInfoTooltipRow name="Normal" info={ data.gas_prices.average }/>
        <GasInfoTooltipRow name="Fast" info={ data.gas_prices.fast }/>
      </Grid>
    </DarkMode>
  );
};

export default React.memo(GasInfoTooltipContent);
