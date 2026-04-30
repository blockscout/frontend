import React from 'react';

import type { ChartDialogProps } from '../components/ChartDialog';
import { ChartDialog } from '../components/ChartDialog';
import type { SankeyChartContentProps } from './SankeyChartContent';
import { SankeyChartContent } from './SankeyChartContent';

interface Props extends Omit<ChartDialogProps, 'children' | 'headerRightSlot'>, SankeyChartContentProps {}

export const SankeyChartModal = React.memo(({ open, onOpenChange, title, description, ...rest }: Props) => {
  return (
    <ChartDialog open={ open } onOpenChange={ onOpenChange } title={ title } description={ description }>
      <SankeyChartContent { ...rest }/>
    </ChartDialog>
  );
});
