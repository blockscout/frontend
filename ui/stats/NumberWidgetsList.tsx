import { Grid } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';

import { numberWidgetsScheme } from './constants/number-widgets-scheme';
import NumberWidget from './NumberWidget';
import NumberWidgetSkeleton from './NumberWidgetSkeleton';

const skeletonsCount = 8;

const NumberWidgetsList = () => {
  const { data, isLoading } = useApiQuery('stats_counters');

  return (
    <Grid
      gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      gridGap={ 4 }
    >
      { isLoading ? [ ...Array(skeletonsCount) ]
        .map((e, i) => <NumberWidgetSkeleton key={ i }/>) :
        numberWidgetsScheme.map(({ id, title }) =>
          data?.counters[id] ? <NumberWidget key={ id } label={ title } value={ Number(data.counters[id]).toLocaleString() }/> : null) }
    </Grid>
  );
};

export default NumberWidgetsList;
