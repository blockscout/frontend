import { Grid } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { STATS_COUNTER } from 'stubs/stats';
import StatsWidget from 'ui/shared/stats/StatsWidget';

import DataFetchAlert from '../shared/DataFetchAlert';

const UNITS_WITHOUT_SPACE = [ 's' ];

function replaceSubstring(str: string, searchValue: string, newValue: string) {
  return str.replace(new RegExp(searchValue, 'g'), newValue);
}

const NumberWidgetsList = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('stats_counters', {
    queryOptions: {
      placeholderData: { counters: Array(10).fill(STATS_COUNTER) },
    },
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  return (
    <Grid
      gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      gridGap={ 4 }
    >
      { data?.counters?.map(
        ({ id, title, value, units, description }, index) => {
          let unitsStr = '';
          if (units && UNITS_WITHOUT_SPACE.includes(units)) {
            unitsStr = units === 'ETH' ? 'RWA' : units;
          } else if (units) {
            unitsStr = units === 'ETH' ? ' RWA' : ' ' + units;
          }
          title = replaceSubstring(title, 'ETH', 'RWA');

          if (description) {
            description = replaceSubstring(description, 'ETH', 'RWA');
          }

          return (
            <StatsWidget
              key={ id + (isPlaceholderData ? index : '') }
              label={ title }
              value={ `${ Number(value).toLocaleString(undefined, {
                maximumFractionDigits: 3,
                notation: 'compact',
              }) }${ unitsStr }` }
              isLoading={ isPlaceholderData }
              hint={ description }
            />
          );
        },
      ) }
    </Grid>
  );
};

export default NumberWidgetsList;
