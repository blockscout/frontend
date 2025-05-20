import { Box, Grid } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type * as stats from '@blockscout/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';
import { Heading } from 'toolkit/chakra/heading';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { apos } from 'toolkit/utils/htmlEntities';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import IconSvg from 'ui/shared/IconSvg';

import ChartsLoadingErrorAlert from './ChartsLoadingErrorAlert';
import ChartWidgetContainer from './ChartWidgetContainer';

type Props = {
  filterQuery: string;
  initialFilterQuery: string;
  isError: boolean;
  isPlaceholderData: boolean;
  charts?: Array<stats.LineChartSection>;
  interval: StatsIntervalIds;
};

const ChartsWidgetsList = ({ filterQuery, isError, isPlaceholderData, charts, interval, initialFilterQuery }: Props) => {
  const [ isSomeChartLoadingError, setIsSomeChartLoadingError ] = useState(false);
  const isAnyChartDisplayed = charts?.some((section) => section.charts.length > 0);
  const isEmptyChartList = Boolean(filterQuery) && !isAnyChartDisplayed;
  const sectionRef = React.useRef<HTMLUListElement | null>(null);

  const shouldScrollToSection = Boolean(initialFilterQuery);

  React.useEffect(() => {
    if (shouldScrollToSection) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ shouldScrollToSection ]);

  const homeStatsQuery = useApiQuery('general:stats', {
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const handleChartLoadingError = useCallback(
    () => setIsSomeChartLoadingError(true),
    [ setIsSomeChartLoadingError ]);

  if (isError) {
    return <ChartsLoadingErrorAlert/>;
  }

  if (isEmptyChartList) {
    return <EmptySearchResult text={ `Couldn${ apos }t find a chart that matches your filter query.` }/>;
  }

  return (
    <Box>
      { isSomeChartLoadingError && (
        <ChartsLoadingErrorAlert/>
      ) }

      <section ref={ sectionRef }>
        {
          charts?.map((section) => (
            <Box
              key={ section.id }
              mb={{ base: 6, lg: 8 }}
              _last={{
                marginBottom: 0,
              }}
            >
              <Skeleton loading={ isPlaceholderData } mb={{ base: 3, lg: 4 }} display="inline-flex" alignItems="center" columnGap={ 2 } id={ section.id }>
                <Heading level="2" id={ section.id }>
                  { section.title }
                </Heading>
                { section.id === 'gas' && homeStatsQuery.data && homeStatsQuery.data.gas_prices && (
                  <GasInfoTooltip data={ homeStatsQuery.data } dataUpdatedAt={ homeStatsQuery.dataUpdatedAt }>
                    <IconSvg name="info" boxSize={ 5 } display="block" cursor="pointer" color="icon.info" _hover={{ color: 'link.primary.hover' }}/>
                  </GasInfoTooltip>
                ) }
              </Skeleton>

              <Grid
                templateColumns={{ lg: 'repeat(2, minmax(0, 1fr))' }}
                gap={{ base: 3, lg: 4 }}
              >
                { section.charts.map((chart) => (
                  <ChartWidgetContainer
                    key={ chart.id }
                    id={ chart.id }
                    title={ chart.title }
                    description={ chart.description }
                    interval={ interval }
                    units={ chart.units || undefined }
                    isPlaceholderData={ isPlaceholderData }
                    onLoadingError={ handleChartLoadingError }
                    href={{ pathname: '/stats/[id]', query: { id: chart.id } }}
                  />
                )) }
              </Grid>
            </Box>
          ))
        }
      </section>
    </Box>
  );
};

export default ChartsWidgetsList;
