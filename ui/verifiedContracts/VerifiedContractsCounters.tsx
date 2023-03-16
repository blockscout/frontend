import { Box, Flex, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';

const VerifiedContractsCounters = () => {
  const countersQuery = useApiQuery('verified_contracts_counters');

  const itemBgColor = useColorModeValue('blue.50', 'blue.800');
  const renderItem = (name: string, total: string, new24: string) => {
    return (
      <Box
        w={{ base: '100%', lg: 'calc((100% - 12px)/2)' }}
        borderRadius="12px"
        backgroundColor={ itemBgColor }
        p={ 3 }
      >
        <Text variant="secondary" fontSize="xs">{ name }</Text>
        <Flex alignItems="baseline">
          <Text fontWeight={ 600 } mr={ 2 } fontSize="lg">{ Number(total).toLocaleString('en') }</Text>
          <Text fontWeight={ 600 } mr={ 1 } fontSize="lg" color="green.500">+{ new24 }</Text>
          <Text variant="secondary" fontSize="sm">(24h)</Text>
        </Flex>
      </Box>
    );
  };

  if (countersQuery.isError) {
    return null;
  }

  const content = (() => {
    if (countersQuery.isLoading) {
      const item = <Skeleton w={{ base: '100%', lg: 'calc((100% - 12px)/2)' }} h="69px" borderRadius="12px"/>;
      return (
        <>
          { item }
          { item }
        </>
      );
    }

    return (
      <>
        { renderItem('Total contracts', countersQuery.data.smart_contracts, countersQuery.data.new_smart_contracts_24h) }
        { renderItem('Verified contracts', countersQuery.data.verified_smart_contracts, countersQuery.data.new_verified_smart_contracts_24h) }
      </>
    );
  })();

  return (
    <Flex columnGap={ 3 } rowGap={ 3 } flexDirection={{ base: 'column', lg: 'row' }} mb={ 6 }>
      { content }
    </Flex>
  );
};

export default VerifiedContractsCounters;
