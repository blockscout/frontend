import { Grid } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import formatNumberToMetricPrefix from 'lib/formatNumberToMetricPrefix';

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
        data?.counters?.map(({ id, title, value, units }) => {

          return (
            <NumberWidget
              key={ id }
              label={ title }
              value={ `${ formatNumberToMetricPrefix(Number(value)) } ${ units }` }
            />
          );
        }) }
    </Grid>
  );
};

export default NumberWidgetsList;
