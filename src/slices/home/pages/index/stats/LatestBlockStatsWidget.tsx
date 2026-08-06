// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useHomeDataContext } from 'src/slices/home/contexts/home-data-context';

import StatsWidget from 'src/shared/stats/StatsWidget';

interface Props extends BoxProps {
  isLoading: boolean;
  fallbackValue: number | string | undefined;
};

const LatestBlockStatsWidget = ({ isLoading, fallbackValue, ...props }: Props) => {
  const { blocksQuery } = useHomeDataContext();

  const value = blocksQuery?.data?.[0]?.height ?? fallbackValue;
  if (value === undefined) {
    return null;
  }

  return (
    <StatsWidget
      icon="block"
      label="Latest block"
      value={ Number(value).toLocaleString() }
      href={{ pathname: '/blocks' }}
      isLoading={ isLoading }
      { ...props }
    />
  );
};

export default chakra(React.memo(LatestBlockStatsWidget));
