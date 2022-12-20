import { Box, Grid, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useColorModeValue, VisuallyHidden } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { TimeChartItem } from './types';

import repeatArrow from 'icons/repeat_arrow.svg';
import dotsIcon from 'icons/vertical_dots.svg';

import ChartWidgetGraph from './ChartWidgetGraph';
import ChartWidgetSkeleton from './ChartWidgetSkeleton';
import FullscreenChartModal from './FullscreenChartModal';

type Props = {
  items?: Array<TimeChartItem>;
  title: string;
  description: string;
  isLoading: boolean;
}

const ChartWidget = ({ items, title, description, isLoading }: Props) => {
  const [ isFullscreen, setIsFullscreen ] = useState(false);
  const [ isZoomResetInitial, setIsZoomResetInitial ] = React.useState(true);

  const borderColor = useColorModeValue('gray.200', 'gray.600');

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

  if (items) {
    return (
      <>
        <Box
          padding={{ base: 3, lg: 4 }}
          borderRadius="md"
          border="1px"
          borderColor={ borderColor }
        >
          <Grid
            gridTemplateColumns="auto auto 36px"
            gridColumnGap={ 2 }
          >
            <Text
              fontWeight={ 600 }
              fontSize="md"
              lineHeight={ 6 }
              as="p"
              size={{ base: 'xs', lg: 'sm' }}
            >
              { title }
            </Text>

            <Text
              mb={ 1 }
              gridColumn={ 1 }
              as="p"
              variant="secondary"
              fontSize="xs"
            >
              { description }
            </Text>

            <Tooltip label="Reset zoom">
              <IconButton
                hidden={ isZoomResetInitial }
                aria-label="Reset zoom"
                colorScheme="blue"
                w={ 9 }
                h={ 8 }
                gridColumn={ 2 }
                justifySelf="end"
                alignSelf="top"
                gridRow="1/3"
                size="sm"
                variant="outline"
                onClick={ handleZoomResetClick }
                icon={ <Icon as={ repeatArrow } w={ 4 } h={ 4 }/> }
              />
            </Tooltip>

            <Menu>
              <MenuButton
                gridColumn={ 3 }
                gridRow="1/3"
                justifySelf="end"
                w="36px"
                h="32px"
                icon={ <Icon as={ dotsIcon } w={ 4 } h={ 4 }/> }
                colorScheme="gray"
                variant="ghost"
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
          description={ description }
          onClose={ clearFullscreenChart }
        />
      </>
    );
  }

  return null;
};

export default ChartWidget;
