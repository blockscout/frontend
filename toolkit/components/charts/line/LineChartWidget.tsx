import type { FlexProps } from '@chakra-ui/react';
import { Flex, Icon } from '@chakra-ui/react';
import { range } from 'es-toolkit';
import React, { useRef } from 'react';

import type { LineChartAxesConfigFn, LineChartData } from './types';

import RepeatIcon from 'icons/repeat.svg';

import { IconButton } from '../../../chakra/icon-button';
import { Link } from '../../../chakra/link';
import { Skeleton } from '../../../chakra/skeleton';
import { Tooltip } from '../../../chakra/tooltip';
import { LineChartWidgetContent } from './LineChartWidgetContent';
import { LineChartLegend } from './parts/LineChartLegend';
import type { ChartMenuItemId } from './parts/LineChartMenu';
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
  menuItemIds?: Array<ChartMenuItemId>;
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
  menuItemIds,
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
    const hasIds = !(menuItemIds && menuItemIds.length === 0);
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

  const content = (
    <LineChartWidgetContent
      charts={ displayedCharts }
      isError={ isError }
      isLoading={ isLoading }
      empty={ !hasNonEmptyCharts }
      emptyText={ emptyText }
      handleZoom={ handleZoom }
      zoomRange={ zoomRange }
      noAnimation={ noAnimation }
      axesConfig={ axesConfig }
      noWatermark={ noWatermark }
    />
  );

  const chartHeader = (
    <Flex
      flexGrow={ 1 }
      flexDir="column"
      alignItems="flex-start"
      cursor={ href ? 'pointer' : 'default' }
      _hover={ href ? { color: 'link.primary.hovered' } : {} }
    >
      <Skeleton
        loading={ isLoading }
        fontWeight={ 600 }
        textStyle="md"
      >
        <span>{ title }</span>
      </Skeleton>

      { description && (
        <Skeleton
          loading={ isLoading }
          color="text.secondary"
          textStyle="xs"
          mt={ 1 }
        >
          <span>{ description }</span>
        </Skeleton>
      ) }
    </Flex>
  );

  return (
    <Flex
      height="100%"
      ref={ ref }
      flexDir="column"
      padding={{ base: 3, lg: 4 }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={{ _light: 'gray.200', _dark: 'gray.600' }}
      { ...rest }
    >
      <Flex columnGap={ 6 } mb={ 2 } alignItems="flex-start">
        { href ? (
          <Link href={ href }>
            { chartHeader }
          </Link>
        ) : chartHeader }
        <Flex ml="auto" columnGap={ 2 }>
          <Tooltip content="Reset zoom">
            <IconButton
              hidden={ !zoomRange }
              aria-label="Reset zoom"
              size="md"
              variant="icon_background"
              onClick={ handleZoomReset }
            >
              <Icon><RepeatIcon/></Icon>
            </IconButton>
          </Tooltip>

          { hasMenu && (
            <LineChartMenu
              charts={ charts }
              itemIds={ menuItemIds }
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

      { content }

      { charts.length > 1 && (
        <LineChartLegend
          data={ charts }
          selectedIndexes={ selectedCharts }
          onItemClick={ handleLegendItemClick }
        />
      ) }
    </Flex>
  );
});
