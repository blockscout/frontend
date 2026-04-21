import React from 'react';

import type { ChartResolution } from '../types';
import type { LineChartData } from './types';

import type { ChartDialogProps } from '../components/ChartDialog';
import { ChartDialog } from '../components/ChartDialog';
import { ChartResetZoomButton } from '../components/ChartResetZoomButton';
import { LineChartContent } from './LineChartContent';

interface Props extends Omit<ChartDialogProps, 'children' | 'headerRightSlot'> {
  charts: LineChartData;
  resolution?: ChartResolution;
  zoomRange?: [ Date, Date ];
  handleZoom: (range: [ Date, Date ]) => void;
  handleZoomReset: () => void;
};

const LineChartFullscreenDialog = ({
  charts,
  open,
  onOpenChange,
  title,
  description,
  resolution,
  zoomRange,
  handleZoom,
  handleZoomReset,
}: Props) => {

  const headerRightSlot = (
    <ChartResetZoomButton
      range={ zoomRange }
      onClick={ handleZoomReset }
      ml="auto"
    />
  );

  return (
    <ChartDialog
      open={ open }
      onOpenChange={ onOpenChange }
      title={ title }
      description={ description }
      headerRightSlot={ headerRightSlot }
    >
      <LineChartContent
        isEnlarged
        charts={ charts }
        onZoom={ handleZoom }
        zoomRange={ zoomRange }
        resolution={ resolution }
      />
    </ChartDialog>
  );
};

export default LineChartFullscreenDialog;
