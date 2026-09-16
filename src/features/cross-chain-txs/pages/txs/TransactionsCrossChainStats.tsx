// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import StatsWidget from 'src/shared/stats/StatsWidget';

import { useCrossChainCountersQuery } from '../../hooks/useCrossChainCountersQuery';

interface Props {}

const TransactionsCrossChainStats = (props: Props) => {
  const { data, isPlaceholderData, isError } = useCrossChainCountersQuery();
  const value = data?.newMessagesInterchain24h;

  if (isError || value === undefined) {
    return null;
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr"
      rowGap={ 3 }
      columnGap={ 3 }
      mb={ 6 }
      { ...props }
    >
      <StatsWidget
        label="Cross-chain txns"
        value={ Number(value).toLocaleString() }
        period="24h"
        isLoading={ isPlaceholderData }
      />
    </Box>
  );
};

export default React.memo(TransactionsCrossChainStats);
