import type { TooltipProps } from '@chakra-ui/react';
import { Box, Grid, Heading, List, ListItem, Skeleton } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { HomeStats, StatsChartsSection } from 'types/api/stats';
import type { StatsIntervalIds } from 'types/client/stats';

import { getResourceKey } from 'lib/api/useApiQuery';
import { apos } from 'lib/html-entities';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import GasInfoTooltipContent from 'ui/shared/GasInfoTooltipContent/GasInfoTooltipContent';
import Hint from 'ui/shared/Hint';

import ChartsLoadingErrorAlert from './ChartsLoadingErrorAlert';
import ChartWidgetContainer from './ChartWidgetContainer';

const GAS_TOOLTIP_PROPS: Partial<TooltipProps> = {
  borderRadius: 'md',
  hasArrow: false,
  padding: 0,
};

type Props = {
  filterQuery: string;
  isError: boolean;
  isPlaceholderData: boolean;
  charts?: Array<StatsChartsSection>;
  interval: StatsIntervalIds;
}

const ChartsWidgetsList = ({ filterQuery, isError, isPlaceholderData, charts, interval }: Props) => {
  const [ isSomeChartLoadingError, setIsSomeChartLoadingError ] = useState(false);
  const isAnyChartDisplayed = charts?.some((section) => section.charts.length > 0);
  const isEmptyChartList = Boolean(filterQuery) && !isAnyChartDisplayed;

  const queryClient = useQueryClient();
  const homeStatsData = queryClient.getQueryData<HomeStats>(getResourceKey('homepage_stats'));

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

      <List>
        {
          charts?.map((section) => (
            <ListItem
              key={ section.id }
              mb={ 8 }
              _last={{
                marginBottom: 0,
              }}
            >
              <Skeleton isLoaded={ !isPlaceholderData } mb={ 4 } display="inline-flex" alignItems="center" columnGap={ 2 }>
                <Heading size="md" >
                  { section.title }
                </Heading>
                { section.id === 'gas' && homeStatsData && homeStatsData.gas_prices &&
                  <Hint label={ <GasInfoTooltipContent data={ homeStatsData }/> } tooltipProps={ GAS_TOOLTIP_PROPS }/> }
              </Skeleton>

              <Grid
                templateColumns={{ lg: 'repeat(2, minmax(0, 1fr))' }}
                gap={ 4 }
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
                  />
                )) }
              </Grid>
            </ListItem>
          ))
        }
      </List>
    </Box>
  );
};

export default ChartsWidgetsList;
