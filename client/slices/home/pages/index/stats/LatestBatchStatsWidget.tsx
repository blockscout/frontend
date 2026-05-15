// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useHomeDataContext } from 'client/slices/home/contexts/home-data-context';

import StatsWidget from 'ui/shared/stats/StatsWidget';

type Props = {
  className?: string;
  isLoading: boolean;
};

const LatestBatchStatsWidget = ({ className, isLoading }: Props) => {
  const { latestBatchQuery } = useHomeDataContext();

  if (latestBatchQuery?.data === undefined) {
    return null;
  }

  return (
    <StatsWidget
      className={ className }
      icon="txn_batches"
      label="Latest batch"
      value={ latestBatchQuery.data.toLocaleString() }
      href={{ pathname: '/batches' }}
      isLoading={ isLoading }
    />
  );
};

export default chakra(React.memo(LatestBatchStatsWidget));
