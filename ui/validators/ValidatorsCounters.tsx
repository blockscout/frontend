import { Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import { getFeaturePayload } from 'configs/app/features/types';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';

import ValidatorsCountersItem from './ValidatorsCountersItem';

const ValidatorsCounters = () => {
  const countersQuery = useApiQuery('validators_counters', {
    pathParams: { chainType: getFeaturePayload(config.features.validators)?.chainType },
    queryOptions: {
      enabled: config.features.validators.isEnabled,
    },
  });

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
        <ValidatorsCountersItem
          name="Total validators"
          value={ countersQuery.data.validators_counter }
          diff={ countersQuery.data.new_validators_counter_24h }
        />
        <ValidatorsCountersItem
          name="Active validators"
          value={ `${ countersQuery.data.active_validators_percentage }%` }
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

export default React.memo(ValidatorsCounters);
