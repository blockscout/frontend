import { Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import type { IconName } from 'public/icons/name';
import React, { useMemo } from 'react';

import type { ProviderInfo } from 'types/api/boolscan';

import useApiQuery from 'lib/api/useApiQuery';
import { currencyUnits } from 'lib/units';
import StatsItem from 'ui/home/StatsItem';

import { formatAmount } from './data';

const ProvidersStats = () => {
  const { data, isLoading } = useApiQuery('provider_stats');

  const statsList = useMemo<
  Array<{
    id: keyof ProviderInfo | 'dhc' | 'stake' | 'unpaidBalance';
    label: string;
    value: string;
    icon: IconName;
  }>
  >(() => {
    const statsData = (key: string) => {
      const _data = data as any;
      let value = _data?.[key];
      let amount = '0';

      if (key === 'unpaidBalance') {
        value =
          BigNumber(_data?.['totalReward']).toNumber() -
          BigNumber(_data?.['totalClaim']).toNumber();
      }

      if (key === 'totalDevice') {
        return _data?.['totalDevice'] ?? '0';
      }

      if (value) {
        amount = formatAmount(value);
      }
      return `${ amount } ${ currencyUnits.ether }`;
    };
    return [
      {
        id: 'totalDevice',
        label: 'Total DHC',
        icon: 'bool/device',
        value: statsData('totalDevice'),
      },
      {
        id: 'totalCap',
        label: 'Total Stake',
        icon: 'bool/stake',
        value: statsData('totalCap'),
      },
      {
        id: 'totalPunish',
        label: 'Total Punish',
        icon: 'bool/punish',
        value: statsData('totalPunish'),
      },
      {
        id: 'totalReward',
        label: 'Total Reward',
        icon: 'bool/reward',
        value: statsData('totalReward'),
      },
      {
        id: 'unpaidBalance',
        label: 'Unpaid Balance',
        icon: 'bool/unpaid',
        value: statsData('unpaidBalance'),
      },
    ];
  }, [ data ]);

  return (
    <Grid
      gridTemplateColumns={{
        lg: `repeat(${ statsList.length }, 1fr)`,
        base: '1fr 1fr',
      }}
      gridTemplateRows={{ lg: 'none', base: undefined }}
      gridGap="10px"
      marginTop="24px"
    >
      { statsList.map((item) => {
        return (
          <StatsItem
            key={ item.id }
            icon={ item.icon }
            title={ item.label }
            value={ item.value }
            isLoading={ isLoading }
          />
        );
      }) }
    </Grid>
  );
};

export default ProvidersStats;
