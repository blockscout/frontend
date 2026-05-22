// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import { VALIDATORS_BLACKFORT_COUNTERS } from 'client/features/chain-variants/blackfort/stubs/validators';

import StatsWidget from 'client/shared/stats/StatsWidget';

import config from 'configs/app';

const ValidatorsCounters = () => {
  const countersQuery = useApiQuery('general:validators_blackfort_counters', {
    queryOptions: {
      enabled: config.features.validators.isEnabled,
      placeholderData: VALIDATORS_BLACKFORT_COUNTERS,
    },
  });

  if (!countersQuery.data) {
    return null;
  }

  return (
    <Box columnGap={ 3 } rowGap={ 3 } mb={ 6 } display="grid" gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}>
      <StatsWidget
        label="Total validators"
        value={ Number(countersQuery.data.validators_count).toLocaleString() }
        diff={ Number(countersQuery.data.new_validators_count_24h).toLocaleString() }
        isLoading={ countersQuery.isPlaceholderData }
      />
    </Box>
  );
};

export default React.memo(ValidatorsCounters);
