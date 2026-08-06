// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useHomeDataContext } from 'src/slices/home/contexts/home-data-context';

import StatsWidget from 'src/shared/stats/StatsWidget';

interface Props extends BoxProps {
  isLoading: boolean;
};

const LatestBatchStatsWidget = ({ isLoading, ...props }: Props) => {
  const { latestBatchQuery } = useHomeDataContext();

  if (latestBatchQuery?.data === undefined) {
    return null;
  }

  return (
    <StatsWidget
      icon="txn_batches"
      label="Latest batch"
      value={ latestBatchQuery.data.toLocaleString() }
      href={{ pathname: '/batches' }}
      isLoading={ isLoading }
      { ...props }
    />
  );
};

export default chakra(React.memo(LatestBatchStatsWidget));
