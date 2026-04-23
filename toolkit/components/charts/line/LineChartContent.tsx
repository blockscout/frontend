import React from 'react';

import type { ChartContentProps } from '../components/ChartContent';
import { ChartContent } from '../components/ChartContent';
import type { LineChartProps } from './LineChart';
import { LineChart } from './LineChart';

export interface LineChartContentProps extends Omit<ChartContentProps, 'children'>, LineChartProps {};

export const LineChartContent = React.memo(({
  isLoading,
  isError,
  isEmpty,
  emptyText,
  noWatermark,
  ...rest
}: LineChartContentProps) => {
  return (
    <ChartContent
      isError={ isError }
      isLoading={ isLoading }
      isEmpty={ isEmpty }
      emptyText={ emptyText }
      noWatermark={ noWatermark }
    >
      <LineChart { ...rest }/>
    </ChartContent>
  );
});
