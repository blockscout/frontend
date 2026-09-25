// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { sortHomeStatsItems, isHomeStatsItemEnabled } from 'src/slices/home/utils/stats';

import { HOMEPAGE_STATS } from 'src/features/multichain/stubs';

import StatsContainer from 'src/shared/stats/StatsContainer';
import StatsWidget from 'src/shared/stats/StatsWidget';

import ChainIndicators from './ChainIndicators';

const COLUMNS_NUM = {
  desktop: 1,
  mobile: 2,
};

const Stats = () => {
  const statsQuery = useApiQuery('multichainStats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const items = React.useMemo(() => {
    return [
      statsQuery.data?.total_multichain_txns && {
        id: 'total_txs' as const,
        label: statsQuery.data.total_multichain_txns.title,
        value: Number(statsQuery.data.total_multichain_txns.value).toLocaleString(),
        icon: 'transactions' as const,
        hint: statsQuery.data.total_multichain_txns.description,
      },
      statsQuery.data?.total_multichain_addresses && {
        id: 'wallet_addresses' as const,
        label: statsQuery.data.total_multichain_addresses.title,
        value: Number(statsQuery.data.total_multichain_addresses.value).toLocaleString(),
        icon: 'wallet' as const,
        hint: statsQuery.data.total_multichain_addresses.description,
      },
    ]
      .filter(Boolean)
      .filter(isHomeStatsItemEnabled)
      .sort(sortHomeStatsItems);
  }, [ statsQuery.data ]);

  return (
    <Flex mt={ 6 } gap={{ base: 1, lg: 2 }} flexDirection={{ base: 'column', lg: 'row' }}>
      { items.length > 0 && (
        <StatsContainer columnsNum={ COLUMNS_NUM } w={{ base: '100%', lg: '270px' }}>
          { items.map((item) => (
            <StatsWidget
              key={ item.id }
              label={ item.label }
              value={ item.value }
              icon={ item.icon }
              isLoading={ statsQuery.isPlaceholderData }
              hint={ item.hint }
              w={{ base: 'calc((100% - 8px) / 2)', lg: '100%' }}
            />
          )) }
        </StatsContainer>
      ) }
      <ChainIndicators/>
    </Flex>
  );
};

export default React.memo(Stats);
