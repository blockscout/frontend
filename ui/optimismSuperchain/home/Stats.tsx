import { Center, Flex } from '@chakra-ui/react';
import React from 'react';

import StatsWidget from 'ui/shared/stats/StatsWidget';

const Stats = () => {
  return (
    <Flex mt={ 6 } gap={ 2 } flexDirection={{ base: 'column', lg: 'row' }}>
      <Flex gap={ 2 } flexDirection={{ base: 'row', lg: 'column' }} w={{ base: '100%', lg: '270px' }}>
        <StatsWidget
          label="Total transactions"
          value="TBD"
          icon="transactions_slim"
        />
        <StatsWidget
          label="Total addresses"
          value="TBD"
          icon="wallet"
        />
      </Flex>
      <Center flexGrow={ 1 } minH={{ base: '140px', lg: '180px' }} bgColor={{ _light: 'gray.50', _dark: 'whiteAlpha.100' }} borderRadius="base">
        Coming soon 🔜
      </Center>
    </Flex>
  );
};

export default React.memo(Stats);
