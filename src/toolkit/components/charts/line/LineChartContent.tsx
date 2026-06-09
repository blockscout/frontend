// SPDX-License-Identifier: LicenseRef-Blockscout

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
  isFiltered,
  emptyText,
  noWatermark,
  noEmptyStateIcon,
  ...rest
}: LineChartContentProps) => {
  return (
    <ChartContent
      isError={ isError }
      isLoading={ isLoading }
      isEmpty={ isEmpty }
      isFiltered={ isFiltered }
      emptyText={ emptyText }
      noWatermark={ noWatermark }
      noEmptyStateIcon={ noEmptyStateIcon }
    >
      <LineChart { ...rest }/>
    </ChartContent>
  );
});
