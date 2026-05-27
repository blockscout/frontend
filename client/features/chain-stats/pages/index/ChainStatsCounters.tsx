// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import ApiFetchAlert from 'client/shared/alerts/ApiFetchAlert';
import StatsWidget from 'client/shared/stats/StatsWidget';

import { CHAIN_STATS_COUNTER } from '../../stubs/counters';

const UNITS_WITHOUT_SPACE = [ 's' ];

const ChainStatsCounters = () => {
  const { data, isPlaceholderData, isError, isRefetchError } = useApiQuery('stats:counters', {
    queryOptions: {
      placeholderData: { counters: Array(10).fill(CHAIN_STATS_COUNTER) },
      refetchInterval: (query) => {
        if (query.state.status === 'error') {
          return false;
        }

        return config.apis.stats?.refetchInterval?.[ 'stats:counters' ];
      },
    },
  });

  if (isError && !isRefetchError) {
    return <ApiFetchAlert/>;
  }

  return (
    <Grid
      gridTemplateColumns={{ base: 'repeat(2, calc((100% - 4px) / 2))', lg: 'repeat(4, calc((100% - 3 * 8px) / 4))' }}
      gridGap={{ base: 1, lg: 2 }}
    >
      {
        data?.counters?.map(({ id, title, value, units, description }, index) => {

          let unitsStr = '';
          if (units && UNITS_WITHOUT_SPACE.includes(units)) {
            unitsStr = units;
          } else if (units) {
            unitsStr = ' ' + units;
          }

          const valueNum = Number(value);
          const maximumFractionDigits = valueNum < 10 ** -3 ? undefined : 3;

          return (
            <StatsWidget
              key={ id + (isPlaceholderData ? index : '') }
              label={ title }
              value={ Number(value).toLocaleString(undefined, { maximumFractionDigits, notation: 'compact' }) }
              valuePostfix={ unitsStr }
              isLoading={ isPlaceholderData }
              hint={ description }
            />
          );
        })
      }
    </Grid>
  );
};

export default ChainStatsCounters;
