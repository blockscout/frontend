import { Center, Flex } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/optimismSuperchain';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const Stats = () => {
  const statsQuery = useApiQuery('multichainStats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  return (
    <Flex mt={ 6 } gap={ 2 } flexDirection={{ base: 'column', lg: 'row' }}>
      <Flex gap={ 2 } flexDirection={{ base: 'row', lg: 'column' }} w={{ base: '100%', lg: '270px' }} _empty={{ display: 'none' }}>
        { statsQuery.data?.total_multichain_txns && (
          <StatsWidget
            label={ statsQuery.data.total_multichain_txns.title }
            value={ Number(statsQuery.data.total_multichain_txns.value).toLocaleString() }
            icon="transactions_slim"
          />
        ) }
        { statsQuery.data?.total_multichain_addresses && (
          <StatsWidget
            label={ statsQuery.data.total_multichain_addresses.title }
            value={ Number(statsQuery.data.total_multichain_addresses.value).toLocaleString() }
            icon="wallet"
          />
        ) }
      </Flex>
      <Center flexGrow={ 1 } minH={{ base: '140px', lg: '180px' }} bgColor={{ _light: 'gray.50', _dark: 'whiteAlpha.100' }} borderRadius="base">
        Coming soon 🔜
      </Center>
    </Flex>
  );
};

export default React.memo(Stats);
