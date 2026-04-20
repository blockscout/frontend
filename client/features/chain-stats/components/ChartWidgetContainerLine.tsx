import React from 'react';

import type { TimeChartItem } from 'toolkit/components/charts/types';

import { ChartWidget, type ChartWidgetProps } from 'toolkit/components/charts/ChartWidget';
import { useChartsConfig } from 'ui/shared/chart/config';

interface Props extends Omit<ChartWidgetProps, 'charts'> {
  data: Array<TimeChartItem>;
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

  return <ChartWidget { ...rest } charts={ charts }/>;
};

export default React.memo(ChartWidgetContainerLine);
