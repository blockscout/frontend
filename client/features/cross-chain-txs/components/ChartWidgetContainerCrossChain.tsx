import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import type { Props as ChartWidgetContainerProps } from 'client/features/chain-stats/components/ChartWidgetContainer';
import { getChartUrl } from 'client/features/chain-stats/utils/chart';
import { SankeyChartWidget } from 'toolkit/components/charts/sankey/SankeyChartWidget';

import useCrossChainChartQuery from '../hooks/useCrossChainChartQuery';
import type { CrossChainTxsChartId } from '../utils/chain-stats';

interface Props extends Omit<ChartWidgetContainerProps, 'id'> {
  id: CrossChainTxsChartId;
}

const ChartWidgetContainerCrossChain = ({ id, interval, isLoading, onLoadingError, className, href, title, description }: Props) => {

  const query = useCrossChainChartQuery({ id, interval, enabled: !isLoading });

  React.useEffect(() => {
    if (query.isError) {
      onLoadingError();
    }
  }, [ query.isError, onLoadingError ]);

  return (
    <SankeyChartWidget
      data={ query.data?.data }
      title={ title }
      description={ description }
      isLoading={ query.isPlaceholderData }
      isError={ query.isError }
      href={ href ? route(href) : undefined }
      chartUrl={ getChartUrl(href) }
      containerProps={{ minH: '230px', className }}
    />
  );
};

export default React.memo(chakra(ChartWidgetContainerCrossChain));
