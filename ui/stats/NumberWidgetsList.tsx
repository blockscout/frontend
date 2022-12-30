import { Grid } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import formatNumberToMetricPrefix from 'lib/formatNumberToMetricPrefix';

import { numberWidgetsScheme } from './constants/number-widgets-scheme';
import NumberWidget from './NumberWidget';
import NumberWidgetSkeleton from './NumberWidgetSkeleton';

const skeletonsCount = 8;

const NumberWidgetsList = () => {
  const { data, isLoading } = useApiQuery('stats_counters');

  const skeletonElement = [ ...Array(skeletonsCount) ]
    .map((e, i) => <NumberWidgetSkeleton key={ i }/>);

  return (
    <Grid
      gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      gridGap={ 4 }
    >
      { isLoading ? skeletonElement :
        numberWidgetsScheme.map(({ id, title, formatFn }) => {
          if (!data?.counters[id]) {
            return null;
          }

          const value = formatNumberToMetricPrefix(Number(data.counters[id]));

          return (
            <NumberWidget
              key={ id }
              label={ title }
              value={ formatFn ?
                formatFn(value) :
                value }
            />
          );
        }) }
    </Grid>
  );
};

export default NumberWidgetsList;
