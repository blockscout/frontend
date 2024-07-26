import { Box } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { VERIFIED_CONTRACTS_COUNTERS } from 'stubs/contract';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const VerifiedContractsCounters = () => {
  const { t } = useTranslation('common');

  const countersQuery = useApiQuery('verified_contracts_counters', {
    queryOptions: {
      placeholderData: VERIFIED_CONTRACTS_COUNTERS,
    },
  });

  if (!countersQuery.data) {
    return null;
  }

  return (
    <Box columnGap={ 3 } rowGap={ 3 } mb={ 6 } display="grid" gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}>
      <StatsWidget
        label={ t('verified_contracts_area.Total_contracts') }
        value={ Number(countersQuery.data.smart_contracts).toLocaleString() }
        diff={ countersQuery.data.new_smart_contracts_24h }
        diffFormatted={ Number(countersQuery.data.new_smart_contracts_24h).toLocaleString() }
        isLoading={ countersQuery.isPlaceholderData }
      />
      <StatsWidget
        label={ t('verified_contracts_area.Verified_contracts') }
        value={ Number(countersQuery.data.verified_smart_contracts).toLocaleString() }
        diff={ countersQuery.data.new_verified_smart_contracts_24h }
        diffFormatted={ Number(countersQuery.data.new_verified_smart_contracts_24h).toLocaleString() }
        isLoading={ countersQuery.isPlaceholderData }
      />
    </Box>
  );
};

export default VerifiedContractsCounters;
