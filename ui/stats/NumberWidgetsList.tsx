import { Grid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { Stats } from 'types/api/stats';
import { QueryKeys } from 'types/client/queries';

import useFetch from 'lib/hooks/useFetch';

import NumberWidget from './NumberWidget';
import NumberWidgetSkeleton from './NumberWidgetSkeleton';

const skeletonsCount = 4;

const NumberWidgetsList = () => {
  const fetch = useFetch();

  const { data, isLoading } = useQuery<unknown, unknown, Stats>(
    [ QueryKeys.stats ],
    // TODO: Just temporary. Remove this when the API is ready.
    async() => await fetch(`/node-api/stats`),
  );

  return (
    <Grid
      gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
      gridGap={ 4 }
    >
      { isLoading ? [ ...Array(skeletonsCount) ]
        .map((e, i) => <NumberWidgetSkeleton key={ i }/>) :
        (
          <NumberWidget
            label="Total blocks"
            value={ Number(data?.total_blocks).toLocaleString() }
          />
        ) }
    </Grid>
  );
};

export default NumberWidgetsList;
