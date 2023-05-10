import { Box, Grid, GridItem, Heading, List, ListItem, Skeleton } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { StatsChartsSection } from 'types/api/stats';
import type { StatsIntervalIds } from 'types/client/stats';

import { apos } from 'lib/html-entities';
import ChartWidgetSkeleton from 'ui/shared/chart/ChartWidgetSkeleton';
import EmptySearchResult from 'ui/shared/EmptySearchResult';

import ChartsLoadingErrorAlert from './ChartsLoadingErrorAlert';
import ChartWidgetContainer from './ChartWidgetContainer';

type Props = {
  filterQuery: string;
  isError: boolean;
  isLoading: boolean;
  charts?: Array<StatsChartsSection>;
  interval: StatsIntervalIds;
}

const skeletonsCount = 4;

const ChartsWidgetsList = ({ filterQuery, isError, isLoading, charts, interval }: Props) => {
  const [ isSomeChartLoadingError, setIsSomeChartLoadingError ] = useState(false);
  const isAnyChartDisplayed = charts?.some((section) => section.charts.length > 0);
  const isEmptyChartList = Boolean(filterQuery) && !isAnyChartDisplayed;

  const handleChartLoadingError = useCallback(
    () => setIsSomeChartLoadingError(true),
    [ setIsSomeChartLoadingError ]);

  const skeletonElement = [ ...Array(skeletonsCount) ]
    .map((e, i) => (
      <GridItem key={ i }>
        <ChartWidgetSkeleton hasDescription={ true }/>
      </GridItem>
    ));

  if (isLoading) {
    return (
      <>
        <Skeleton w="30%" h="32px" mb={ 4 }/>
        <Grid
          templateColumns={{
            lg: 'repeat(2, minmax(0, 1fr))',
          }}
          gap={ 4 }
        >
          { skeletonElement }
        </Grid>
      </>
    );
  }

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
              <Heading
                size="md"
                mb={ 4 }
              >
                { section.title }
              </Heading>

              <Grid
                templateColumns={{
                  lg: 'repeat(2, minmax(0, 1fr))',
                }}
                gap={ 4 }
              >
                { section.charts.map((chart) => (
                  <GridItem
                    key={ chart.id }
                  >
                    <ChartWidgetContainer
                      id={ chart.id }
                      title={ chart.title }
                      description={ chart.description }
                      interval={ interval }
                      units={ chart.units || undefined }
                      onLoadingError={ handleChartLoadingError }
                    />
                  </GridItem>
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
