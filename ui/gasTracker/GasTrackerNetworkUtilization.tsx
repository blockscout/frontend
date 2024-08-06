import { Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import { mdash } from 'lib/html-entities';
import colors from 'theme/foundations/colors';

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

  const colorsDef = {
    high: colors.error[500],
    medium: colors.warning[500],
    low: colors.success[500],
  };
  const color = colorsDef[load];

  return (
    <Skeleton isLoaded={ !isLoading } whiteSpace="pre-wrap">
      <span>Network utilization </span>
      <chakra.span color={ color }>{ percentage.toFixed(2) }% { mdash } { load } load</chakra.span>
    </Skeleton>
  );
};

export default React.memo(GasTrackerNetworkUtilization);
