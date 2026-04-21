import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { range } from 'es-toolkit';
import React, { useRef } from 'react';

import type { LineChartAxesConfigFn, LineChartData } from './types';

import type { ChartMenuItemId } from '../components/ChartMenu';
import { ChartResetZoomButton } from '../components/ChartResetZoomButton';
import { ChartWidgetRoot, ChartWidgetHeader } from '../components/ChartWidget';
import { LineChartContent } from './LineChartContent';
import { LineChartLegend } from './parts/LineChartLegend';
import LineChartMenu from './parts/LineChartMenu';
import { useLineChartZoom } from './utils/useLineChartZoom';

export interface LineChartWidgetProps extends FlexProps {
  charts: LineChartData;
  title: string;
  description?: string;
  isLoading: boolean;
  isError: boolean;
  emptyText?: string;
  noAnimation?: boolean;
  href?: string;
  chartUrl?: string;
  axesConfig?: LineChartAxesConfigFn;
  menuItems?: Array<ChartMenuItemId>;
  noWatermark?: boolean;
};

export const LineChartWidget = React.memo(({
  charts,
  title,
  description,
  isLoading,
  isError,
  emptyText,
  noAnimation,
  href,
  chartUrl,
  axesConfig,
  menuItems,
  noWatermark,
  ...rest
}: LineChartWidgetProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { zoomRange, handleZoom, handleZoomReset } = useLineChartZoom();

  const [ selectedCharts, setSelectedCharts ] = React.useState<Array<number>>(
    range(charts.length),
  );

  React.useEffect(() => {
    if (charts.length > 0) {
      setSelectedCharts(range(charts.length));
    }
  }, [ charts.length ]);

  const handleLegendItemClick = React.useCallback((index: number) => {
    setSelectedCharts((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      }
      return [ ...prev, index ];
    });
  }, []);

  const displayedCharts = React.useMemo(() => {
    return charts.filter((_, index) => selectedCharts.includes(index));
  }, [ charts, selectedCharts ]);

  const hasNonEmptyCharts = charts.some(({ items }) => items && items.length > 2);
  const hasMenu = (() => {
    const hasIds = !(menuItems && menuItems.length === 0);
    if (!hasIds) {
      return false;
    }
    if (isError) {
      return false;
    }
    if (!hasNonEmptyCharts) {
      return false;
    }
    return true;
  })();

  return (
    <ChartWidgetRoot { ...rest }>
      <Flex columnGap={ 6 } mb={ 2 } alignItems="flex-start">
        <ChartWidgetHeader href={ href } title={ title } description={ description } isLoading={ isLoading }/>
        <Flex ml="auto" columnGap={ 2 }>
          <ChartResetZoomButton range={ zoomRange } onClick={ handleZoomReset }/>

          { hasMenu && (
            <LineChartMenu
              charts={ charts }
              items={ menuItems }
              title={ title }
              description={ description }
              chartUrl={ chartUrl }
              isLoading={ isLoading }
              chartRef={ ref }
              handleZoom={ handleZoom }
              handleZoomReset={ handleZoomReset }
              zoomRange={ zoomRange }
            />
          ) }
        </Flex>
      </Flex>

      <LineChartContent
        charts={ displayedCharts }
        isError={ isError }
        isLoading={ isLoading }
        isEmpty={ !hasNonEmptyCharts }
        emptyText={ emptyText }
        onZoom={ handleZoom }
        zoomRange={ zoomRange }
        noAnimation={ noAnimation }
        axesConfig={ axesConfig }
        noWatermark={ noWatermark }
      />

      { charts.length > 1 && (
        <LineChartLegend
          data={ charts }
          selectedIndexes={ selectedCharts }
          onItemClick={ handleLegendItemClick }
        />
      ) }
    </ChartWidgetRoot>
  );
});
