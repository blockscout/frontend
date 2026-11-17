// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { VALIDATORS_BLACKFORT_COUNTERS } from 'src/features/chain-variants/blackfort/stubs/validators';

import config from 'src/config';
import StatsContainer from 'src/shared/stats/StatsContainer';
import StatsWidget from 'src/shared/stats/StatsWidget';

const ValidatorsCounters = () => {
  const countersQuery = useApiQuery('core:validators_blackfort_counters', {
    queryOptions: {
      enabled: config.features.validators.isEnabled,
      placeholderData: VALIDATORS_BLACKFORT_COUNTERS,
    },
  });

  if (!countersQuery.data) {
    return null;
  }

  return (
    <StatsContainer mb={ 6 }>
      <StatsWidget
        label="Total validators"
        value={ Number(countersQuery.data.validators_count).toLocaleString() }
        diff={ Number(countersQuery.data.new_validators_count_24h).toLocaleString() }
        isLoading={ countersQuery.isPlaceholderData }
      />
    </StatsContainer>
  );
};

export default React.memo(ValidatorsCounters);
