import React from 'react';

import type { SankeyChartData } from '../types';

import { useDisclosure } from '../../../../hooks/useDisclosure';
import type { ChartMenuProps } from '../../components/ChartMenu';
import { ChartMenu } from '../../components/ChartMenu';
import { SankeyChartModal } from '../SankeyChartModal';

export interface SankeyChartMenuProps extends Omit<ChartMenuProps, 'csvData' | 'onFullscreenOpen'> {
  data?: SankeyChartData;
}

export const SankeyChartMenu = React.memo(({ data, ...rest }: SankeyChartMenuProps) => {
  const modal = useDisclosure();

  const handleModalOpen = React.useCallback(() => {
    modal.onOpenChange({ open: true });
  }, [ modal ]);

  const csvData = React.useMemo(() => {
    if (!data) {
      return [];
    }
    const headerRows = [ 'Source', 'Target', 'Value' ];
    const dataRows = data.links.map((link) => {
      const source = data.nodes.find((node) => node.id === link.source)?.name;
      const target = data.nodes.find((node) => node.id === link.target)?.name;
      return [ source ?? '', target ?? '', String(link.value) ];
    });
    return [ headerRows, ...dataRows ];
  }, [ data ]);

  return (
    <>
      <ChartMenu { ...rest } csvData={ csvData } onFullscreenOpen={ handleModalOpen }/>
      <SankeyChartModal
        open={ modal.open }
        onOpenChange={ modal.onOpenChange }
        data={ data }
        title={ rest.title }
        description={ rest.description }
      />
    </>
  );
});
