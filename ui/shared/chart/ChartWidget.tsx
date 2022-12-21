import { Box, Grid, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useColorModeValue, VisuallyHidden } from '@chakra-ui/react';
import domToImage from 'dom-to-image';
import React, { useRef, useCallback, useState } from 'react';

import type { TimeChartItem } from './types';

import imageIcon from 'icons/image.svg';
import repeatArrow from 'icons/repeat_arrow.svg';
import scopeIcon from 'icons/scope.svg';
import dotsIcon from 'icons/vertical_dots.svg';

import ChartWidgetGraph from './ChartWidgetGraph';
import ChartWidgetSkeleton from './ChartWidgetSkeleton';
import FullscreenChartModal from './FullscreenChartModal';

type Props = {
  items?: Array<TimeChartItem>;
  title: string;
  description?: string;
  isLoading: boolean;
}

const DOWNLOAD_IMAGE_SCALE = 5;

const ChartWidget = ({ items, title, description, isLoading }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
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

  const handleFileSaveClick = useCallback(() => {
    if (ref.current) {
      domToImage.toPng(ref.current,
        {
          quality: 100,
          bgcolor: 'white',
          width: ref.current.offsetWidth * DOWNLOAD_IMAGE_SCALE,
          height: ref.current.offsetHeight * DOWNLOAD_IMAGE_SCALE,
          filter: (node) => node.nodeName !== 'BUTTON',
          style: {
            transform: `scale(${ DOWNLOAD_IMAGE_SCALE })`,
            'transform-origin': 'top left',
          },
        })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `${ title } (Blockscout chart).png`;
          link.href = dataUrl;
          link.click();
          link.remove();
        });
    }
  }, [ title ]);

  if (isLoading) {
    return <ChartWidgetSkeleton hasDescription={ Boolean(description) }/>;
  }

  if (items) {
    return (
      <>
        <Box
          ref={ ref }
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

            { description && (
              <Text
                mb={ 1 }
                gridColumn={ 1 }
                as="p"
                variant="secondary"
                fontSize="xs"
              >
                { description }
              </Text>
            ) }

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
                <MenuItem
                  display="flex"
                  alignItems="center"
                  onClick={ showChartFullscreen }
                >
                  <Icon as={ scopeIcon } boxSize={ 4 } mr={ 3 }/>
                  View fullscreen
                </MenuItem>
                <MenuItem
                  display="flex"
                  alignItems="center"
                  onClick={ handleFileSaveClick }
                >
                  <Icon as={ imageIcon } boxSize={ 4 } mr={ 3 }/>
                  Save as PNG
                </MenuItem>
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
