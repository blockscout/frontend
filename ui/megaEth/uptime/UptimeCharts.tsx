import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import * as d3 from 'd3';
import React from 'react';

import type { UptimeHistoryFull } from 'types/api/megaEth';

import { Heading } from 'toolkit/chakra/heading';
import { SECOND } from 'toolkit/utils/consts';
import ChartWidget from 'ui/shared/chart/ChartWidget';
import TagGroupSelect from 'ui/shared/tagGroupSelect/TagGroupSelect';

const INTERVALS = [
  { id: '3h', title: '3h' } as const,
  { id: '24h', title: '24h' } as const,
  { id: '7d', title: '7d' } as const,
];

type IntervalId = (typeof INTERVALS)[number]['id'];

const TIME_FORMAT = '%e %b %Y, %H:%M:%S';

interface Props {
  historyData: UptimeHistoryFull | null;
}

const UptimeCharts = ({ historyData }: Props) => {
  const [ interval, setInterval ] = React.useState<IntervalId>('3h');

  const tpsItems = React.useMemo(() => {
    if (!historyData) {
      return [];
    }

    const data = (() => {
      switch (interval) {
        case '3h':
          return historyData.historical_tps_3h;
        case '7d':
          return historyData.historical_tps_7d;
        case '24h':
          return historyData.historical_tps_24h;
      }
    })();

    return data.map(({ value, timestamp }) => {
      const date = new Date(timestamp * SECOND);

      return { date, value, dateLabel: d3.timeFormat(TIME_FORMAT)(date) };
    });
  }, [ historyData, interval ]);

  const gasItems = React.useMemo(() => {
    if (!historyData) {
      return [];
    }

    const data = (() => {
      switch (interval) {
        case '3h':
          return historyData.historical_gas_per_second_3h;
        case '7d':
          return historyData.historical_gas_per_second_7d;
        case '24h':
          return historyData.historical_gas_per_second_24h;
      }
    })();

    return data.map(({ value, timestamp }) => {
      const date = new Date(timestamp * SECOND);

      return { date, value, dateLabel: d3.timeFormat(TIME_FORMAT)(date) };
    });
  }, [ historyData, interval ]);

  const blockIntervalItems = React.useMemo(() => {
    if (!historyData) {
      return [];
    }

    const data = (() => {
      switch (interval) {
        case '3h':
          return historyData.historical_mini_block_interval_3h;
        case '7d':
          return historyData.historical_mini_block_interval_7d;
        case '24h':
          return historyData.historical_mini_block_interval_24h;
      }
    })();

    return data.map(({ value, timestamp }) => {
      const date = new Date(timestamp * SECOND);

      return { date, value, dateLabel: d3.timeFormat(TIME_FORMAT)(date) };
    });
  }, [ historyData, interval ]);

  const handleIntervalChange = React.useCallback((newInterval: IntervalId) => {
    setInterval(newInterval);
  }, [ setInterval ]);

  return (
    <Box>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mb={ 6 }
      >
        <Heading level="2">Real-time statistics</Heading>
        <TagGroupSelect<IntervalId> items={ INTERVALS } onChange={ handleIntervalChange } value={ interval } tagSize="lg"/>
      </Flex>
      <Grid
        templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
        gap={ 4 }
      >
        <GridItem colSpan={{ base: 1, lg: 2 }} minH={{ base: '220px', lg: '320px' }}>
          <ChartWidget
            title="TPS"
            items={ tpsItems }
            isLoading={ false }
            isError={ false }
          />
        </GridItem>
        <GridItem minH={{ base: '220px', lg: '320px' }}>
          <ChartWidget
            title="MGas / s"
            items={ gasItems }
            isLoading={ false }
            isError={ false }
          />
        </GridItem>
        <GridItem minH={{ base: '220px', lg: '320px' }}>
          <ChartWidget
            title="Block time (ms)"
            items={ blockIntervalItems }
            isLoading={ false }
            isError={ false }
          />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default React.memo(UptimeCharts);
