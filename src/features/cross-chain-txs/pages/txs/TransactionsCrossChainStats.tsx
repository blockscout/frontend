// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import StatsContainer from 'src/shared/stats/StatsContainer';
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
    <StatsContainer mb={ 6 } { ...props }>
      <StatsWidget
        label="Cross-chain txns"
        value={ Number(value).toLocaleString() }
        period="24h"
        isLoading={ isPlaceholderData }
      />
    </StatsContainer>
  );
};

export default React.memo(TransactionsCrossChainStats);
