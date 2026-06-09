// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { LineChartWidgetProps } from 'src/toolkit/components/charts/line';
import { LineChartWidget } from 'src/toolkit/components/charts/line';

import { useChartsConfig } from './line-chart-config';

const LineChartWidgetPwStory = ({ charts, ...props }: LineChartWidgetProps) => {
  const chartsConfig = useChartsConfig();

  const modifiedCharts = React.useMemo(() => {
    return charts.map((chart) => {
      if (chart.charts.length === 0) {
        return {
          ...chart,
          charts: chartsConfig,
        };
      }
      return chart;
    });
  }, [ charts, chartsConfig ]);

  return <LineChartWidget { ...props } charts={ modifiedCharts }/>;
};

export default React.memo(LineChartWidgetPwStory);
