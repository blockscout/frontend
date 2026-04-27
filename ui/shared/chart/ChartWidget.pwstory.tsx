import React from 'react';

import type { LineChartWidgetProps } from 'toolkit/components/charts/line';
import { LineChartWidget } from 'toolkit/components/charts/line';

import { useChartsConfig } from './config';

const ChartWidgetPwStory = ({ charts, ...props }: LineChartWidgetProps) => {
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

export default React.memo(ChartWidgetPwStory);
