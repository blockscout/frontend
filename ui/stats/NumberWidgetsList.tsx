import { Grid } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';

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
        (
          <>
            <NumberWidget
              label="Total blocks"
              value={ Number(data?.counters.totalBlocksAllTime).toLocaleString() }
            />
            <NumberWidget
              label="Average block time"
              value={ Number(data?.counters.averageBlockTime).toLocaleString() }
            />
            <NumberWidget
              label="Completed transactions"
              value={ Number(data?.counters.completedTransactions).toLocaleString() }
            />
            <NumberWidget
              label="Total transactions"
              value={ Number(data?.counters.totalTransactions).toLocaleString() }
            />
            <NumberWidget
              label="Total accounts"
              value={ Number(data?.counters.totalAccounts).toLocaleString() }
            />
          </>
        ) }
    </Grid>
  );
};

export default NumberWidgetsList;
