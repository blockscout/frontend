import dayjs from 'dayjs';
import React from 'react';

import type { ChartResolution } from '../../types';
import type { LineChartData } from '../types';

import { useDisclosure } from '../../../../hooks/useDisclosure';
import type { ChartMenuProps } from '../../components/ChartMenu';
import { ChartMenu } from '../../components/ChartMenu';
import LineChartModal from '../LineChartModal';

export interface Props extends Omit<ChartMenuProps, 'csvData' | 'onFullscreenOpen'> {
  charts: LineChartData;
  resolution?: ChartResolution;
  zoomRange?: [ Date, Date ];
  handleZoom: (range: [ Date, Date ]) => void;
  handleZoomReset: () => void;
};

const LineChartMenu = ({
  items,
  charts,
  title,
  description,
  isLoading,
  chartRef,
  chartUrl,
  resolution,
  zoomRange,
  handleZoom,
  handleZoomReset,
  onShare,
}: Props) => {
  const modal = useDisclosure();

  const handleModalOpen = React.useCallback(() => {
    modal.onOpenChange({ open: true });
  }, [ modal ]);

  const csvData = React.useMemo(() => {
    const headerRows = [
      'Date', ...charts.map((chart) => chart.name),
    ];
    const dataRows = charts[0].items.map((item, index) => [
      item.dateLabel ?? dayjs(item.date).format('YYYY-MM-DD'),
      ...charts.map((chart) => String(chart.items[index].value)),
    ]);
    return [ headerRows, ...dataRows ];
  }, [ charts ]);

  return (
    <>
      <ChartMenu
        title={ title }
        description={ description }
        items={ items }
        csvData={ csvData }
        chartUrl={ chartUrl }
        isLoading={ isLoading }
        chartRef={ chartRef }
        onFullscreenOpen={ handleModalOpen }
        onShare={ onShare }
      />
      <LineChartModal
        open={ modal.open }
        onOpenChange={ modal.onOpenChange }
        charts={ charts }
        title={ title }
        description={ description }
        resolution={ resolution }
        zoomRange={ zoomRange }
        handleZoom={ handleZoom }
        handleZoomReset={ handleZoomReset }
      />
    </>
  );
};

export default LineChartMenu;
