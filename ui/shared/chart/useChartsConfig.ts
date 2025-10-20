import React from 'react';

import type { ChartConfig } from 'toolkit/components/charts/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { useDefaultGradient, useDefaultLineColor } from 'toolkit/components/charts/utils/styles';

export default function useChartsConfig(): Array<ChartConfig> {
  const lineColor = useDefaultLineColor();
  const gradient = useDefaultGradient();
  const isMobile = useIsMobile();

  return React.useMemo(() => [
    {
      type: 'line',
      color: lineColor,
      strokeWidth: isMobile ? 1 : 2,
    },
    {
      type: 'area',
      gradient,
    },
  ], [ lineColor, isMobile, gradient ]);
}
