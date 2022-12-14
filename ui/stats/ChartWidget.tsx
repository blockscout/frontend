import { Box, Grid, Heading, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue, VisuallyHidden } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { Charts } from 'types/api/stats';
import { QueryKeys } from 'types/client/queries';
import type { StatsIntervalIds } from 'types/client/stats';

import repeatArrow from 'icons/repeat_arrow.svg';
import dotsIcon from 'icons/vertical_dots.svg';
import useFetch from 'lib/hooks/useFetch';

import ChartWidgetGraph from './ChartWidgetGraph';
import ChartWidgetSkeleton from './ChartWidgetSkeleton';
import { STATS_INTERVALS } from './constants';
import FullscreenChartModal from './FullscreenChartModal';

type Props = {
  id: string;
  title: string;
  description: string;
  interval: StatsIntervalIds;
}

function formatDate(date: Date) {
  return date.toISOString().substring(0, 10);
}

const ChartWidget = ({ id, title, description, interval }: Props) => {
  const fetch = useFetch();

  const selectedInterval = STATS_INTERVALS[interval];

  const [ isFullscreen, setIsFullscreen ] = useState(false);
  const [ isZoomResetInitial, setIsZoomResetInitial ] = React.useState(true);

  const endDate = selectedInterval.start ? formatDate(new Date()) : undefined;
  const startDate = selectedInterval.start ? formatDate(selectedInterval.start) : undefined;

  const menuButtonColor = useColorModeValue('black', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const url = `/node-api/stats/charts?name=${ id }${ startDate ? `&from=${ startDate }&to=${ endDate }` : '' }`;

  const { data, isLoading } = useQuery<unknown, unknown, Charts>(
    [ QueryKeys.charts, id, startDate ],
    async() => await fetch(url),
  );

  const handleZoom = useCallback(() => {
    setIsZoomResetInitial(false);
  }, []);

  const handleZoomResetClick = useCallback(() => {
    setIsZoomResetInitial(true);
  }, []);

  const showChartFullscreen = useCallback(() => {
    setIsFullscreen(true);

    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }, []);

  const clearFullscreenChart = useCallback(() => {
    setIsFullscreen(false);

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  if (isLoading) {
    return <ChartWidgetSkeleton/>;
  }

  if (data) {
    const items = data.chart
      .map((item) => {
        return { date: new Date(item.date), value: Number(item.value) };
      });

    return (
      <>
        <Box
          padding={{ base: 3, md: 4 }}
          borderRadius="md"
          border="1px"
          borderColor={ borderColor }
        >
          <Grid
            gridTemplateColumns="auto auto 36px"
            gridColumnGap={ 2 }
          >
            <Heading
              mb={ 1 }
              size={{ base: 'xs', md: 'sm' }}
            >
              { title }
            </Heading>

            <Text
              mb={ 1 }
              gridColumn={ 1 }
              as="p"
              variant="secondary"
              fontSize="xs"
            >
              { description }
            </Text>

            <IconButton
              hidden={ isZoomResetInitial }
              aria-label="Reset zoom"
              title="Reset zoom"
              colorScheme="blue"
              w={ 9 }
              h={ 8 }
              gridColumn={ 2 }
              justifySelf="end"
              alignSelf="top"
              gridRow="1/3"
              size="sm"
              variant="ghost"
              onClick={ handleZoomResetClick }
              icon={ <Icon as={ repeatArrow } w={ 4 } h={ 4 } color="blue.700"/> }
            />

            <Menu>
              <MenuButton
                gridColumn={ 3 }
                gridRow="1/3"
                justifySelf="end"
                w="36px"
                h="32px"
                icon={ <Icon as={ dotsIcon } w={ 4 } h={ 4 } color={ menuButtonColor }/> }
                colorScheme="transparent"
                as={ IconButton }
              >
                <VisuallyHidden>
                 Open chart options menu
                </VisuallyHidden>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={ showChartFullscreen }>View fullscreen</MenuItem>
              </MenuList>
            </Menu>
          </Grid>

          <ChartWidgetGraph
            items={ items }
            onZoom={ handleZoom }
            isZoomResetInitial={ isZoomResetInitial }
            title={ title }
          />
        </Box>

        <FullscreenChartModal
          isOpen={ isFullscreen }
          items={ items }
          title={ title }
          onClose={ clearFullscreenChart }
        />
      </>
    );
  }

  return null;
};

export default ChartWidget;
