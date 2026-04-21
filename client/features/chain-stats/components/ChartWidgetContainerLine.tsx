import React from 'react';

import type { LineChartItem } from 'toolkit/components/charts/line/types';

import { LineChartWidget, type LineChartWidgetProps } from 'toolkit/components/charts/line/LineChartWidget';
import { useChartsConfig } from 'ui/shared/chart/config';

interface Props extends Omit<LineChartWidgetProps, 'charts'> {
  data: Array<LineChartItem>;
  id: string;
  units?: string;
}

const ChartWidgetContainerLine = ({ data, id, units, ...rest }: Props) => {
  const chartsConfig = useChartsConfig();

  const charts = React.useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    return [
      {
        id,
        name: 'Value',
        items: data,
        charts: chartsConfig,
        units,
      },
    ];
  }, [ id, units, data, chartsConfig ]);

  return <LineChartWidget { ...rest } charts={ charts }/>;
};

export default React.memo(ChartWidgetContainerLine);
