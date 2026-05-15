// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useHomeDataContext } from 'client/slices/home/contexts/home-data-context';

import StatsWidget from 'ui/shared/stats/StatsWidget';

type Props = {
  className?: string;
  isLoading: boolean;
  fallbackValue: number | string | undefined;
};

const LatestBlockStatsWidget = ({ className, isLoading, fallbackValue }: Props) => {
  const { blocksQuery } = useHomeDataContext();

  const value = blocksQuery?.data?.[0]?.height ?? fallbackValue;
  if (value === undefined) {
    return null;
  }

  return (
    <StatsWidget
      className={ className }
      icon="block"
      label="Latest block"
      value={ Number(value).toLocaleString() }
      href={{ pathname: '/blocks' }}
      isLoading={ isLoading }
    />
  );
};

export default chakra(React.memo(LatestBlockStatsWidget));
