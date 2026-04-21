import React from 'react';

import type { SankeyChartData } from './types';

import type { ChartContentProps } from '../components/ChartContent';
import { ChartContent } from '../components/ChartContent';
import type { SankeyChartProps } from './SankeyChart';
import { SankeyChart } from './SankeyChart';

export interface SankeyChartContentProps extends Omit<ChartContentProps, 'children'>, SankeyChartProps {
  data: SankeyChartData;
}

export const SankeyChartContent = React.memo(({ data, isError, isLoading, isEmpty, emptyText, noWatermark, ...rest }: SankeyChartContentProps) => {
  return (
    <ChartContent
      isError={ isError }
      isLoading={ isLoading }
      isEmpty={ isEmpty !== undefined ? isEmpty : !data?.nodes?.length || !data?.links?.length }
      emptyText={ emptyText }
      noWatermark={ noWatermark }
    >
      <SankeyChart data={ data } { ...rest }/>
    </ChartContent>
  );
});
