import { Box, Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { STATS_CHARTS } from 'stubs/stats';
import { Link } from 'toolkit/chakra/link';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import ChartWidgetContainer from 'ui/stats/ChartWidgetContainer';

const GAS_PRICE_CHART_ID = 'averageGasPrice';

const GasTrackerChart = () => {
  const [ isChartLoadingError, setChartLoadingError ] = React.useState(false);
  const { data, isPlaceholderData, isError } = useApiQuery('stats_lines', {
    queryOptions: {
      placeholderData: STATS_CHARTS,
    },
  });

  const handleLoadingError = React.useCallback(() => {
    setChartLoadingError(true);
  }, []);

  const content = (() => {
    if (isPlaceholderData) {
      return <ContentLoader/>;
    }

    if (isChartLoadingError || isError) {
      return <DataFetchAlert/>;
    }

    const chart = data?.sections.map((section) => section.charts.find((chart) => chart.id === GAS_PRICE_CHART_ID)).filter(Boolean)?.[0];

    if (!chart) {
      return <DataFetchAlert/>;
    }

    return (
      <ChartWidgetContainer
        id={ GAS_PRICE_CHART_ID }
        title={ chart.title }
        description={ chart.description }
        interval="oneMonth"
        units={ chart.units || undefined }
        isPlaceholderData={ isPlaceholderData }
        onLoadingError={ handleLoadingError }
        h="320px"
      />
    );
  })();

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={ 6 }>
        <chakra.h3 textStyle="h3">Gas price history</chakra.h3>
        <Link href={ route({ pathname: '/stats', hash: 'gas' }) }>Charts & stats</Link>
      </Flex>
      { content }
    </Box>
  );
};

export default React.memo(GasTrackerChart);
