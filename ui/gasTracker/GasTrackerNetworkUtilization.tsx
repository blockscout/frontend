import { chakra } from '@chakra-ui/react';
import React from 'react';

import { mdash } from 'lib/html-entities';
import Skeleton from 'ui/shared/chakra/Skeleton';

interface Props {
  percentage: number;
  isLoading: boolean;
}

const GasTrackerNetworkUtilization = ({ percentage, isLoading }: Props) => {
  const load = (() => {
    if (percentage > 80) {
      return 'high';
    }

    if (percentage > 50) {
      return 'medium';
    }

    return 'low';
  })();

  const colors = {
    high: 'red.600',
    medium: 'orange.600',
    low: 'green.600',
  };
  const color = colors[load];

  return (
    <Skeleton isLoaded={ !isLoading } whiteSpace="pre-wrap">
      <span>Network utilization </span>
      <chakra.span color={ color }>{ percentage.toFixed(2) }% { mdash } { load } load</chakra.span>
    </Skeleton>
  );
};

export default React.memo(GasTrackerNetworkUtilization);
