// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import getChainUtilizationParams from 'client/shared/chain/get-chain-utilization-params';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { mdash } from 'toolkit/utils/htmlEntities';

interface Props {
  percentage: number;
  isLoading: boolean;
}

const GasTrackerNetworkUtilization = ({ percentage, isLoading }: Props) => {
  const { load, color } = getChainUtilizationParams(percentage);

  return (
    <Skeleton loading={ isLoading } whiteSpace="pre-wrap">
      <span>Network utilization </span>
      <chakra.span color={ color }>{ percentage.toFixed(2) }% { mdash } { load } load</chakra.span>
    </Skeleton>
  );
};

export default React.memo(GasTrackerNetworkUtilization);
