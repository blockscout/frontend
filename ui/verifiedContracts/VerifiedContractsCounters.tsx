import { Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';

import VerifiedContractsCountersItem from './VerifiedContractsCountersItem';

const VerifiedContractsCounters = () => {
  const countersQuery = useApiQuery('verified_contracts_counters');

  if (countersQuery.isError) {
    return null;
  }

  const content = (() => {
    if (countersQuery.isPending) {
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
        <VerifiedContractsCountersItem
          name="Total contracts"
          total={ countersQuery.data.smart_contracts }
          new24={ countersQuery.data.new_smart_contracts_24h }
        />
        <VerifiedContractsCountersItem
          name="Verified contracts"
          total={ countersQuery.data.verified_smart_contracts }
          new24={ countersQuery.data.new_verified_smart_contracts_24h }
        />
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
