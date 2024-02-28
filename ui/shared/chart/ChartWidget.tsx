import {
  Box,
  Center,
  chakra,
  Flex,
  IconButton, Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
  Tooltip,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import domToImage from 'dom-to-image';
import React, { useRef, useCallback, useState } from 'react';

import type { TimeChartItem } from './types';

import dayjs from 'lib/date/dayjs';
import { apos } from 'lib/html-entities';
import saveAsCSV from 'lib/saveAsCSV';
import IconSvg from 'ui/shared/IconSvg';

import ChartWidgetGraph from './ChartWidgetGraph';
import FullscreenChartModal from './FullscreenChartModal';

export type Props = {
  items?: Array<TimeChartItem>;
  title: string;
  description?: string;
  units?: string;
  isLoading: boolean;
  className?: string;
  isError: boolean;
}

const DOWNLOAD_IMAGE_SCALE = 5;

const ChartWidget = ({ items, title, description, isLoading, className, isError, units }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ isFullscreen, setIsFullscreen ] = useState(false);
  const [ isZoomResetInitial, setIsZoomResetInitial ] = React.useState(true);

  const pngBackgroundColor = useColorModeValue('white', 'black');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleZoom = useCallback(() => {
    setIsZoomResetInitial(false);
  }, []);

  const handleZoomResetClick = useCallback(() => {
    setIsZoomResetInitial(true);
  }, []);

  const showChartFullscreen = useCallback(() => {
    setIsFullscreen(true);
  }, []);

  const clearFullscreenChart = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const handleFileSaveClick = useCallback(() => {
    // wait for context menu to close
    setTimeout(() => {
      if (ref.current) {
        domToImage.toPng(ref.current,
          {
            quality: 100,
            bgcolor: pngBackgroundColor,
            width: ref.current.offsetWidth * DOWNLOAD_IMAGE_SCALE,
            height: ref.current.offsetHeight * DOWNLOAD_IMAGE_SCALE,
            filter: (node) => node.nodeName !== 'BUTTON',
            style: {
              borderColor: 'transparent',
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
    }, 100);
  }, [ pngBackgroundColor, title ]);

  const handleSVGSavingClick = useCallback(() => {
    if (items) {
      const headerRows = [
        'Date', 'Value',
      ];
      const dataRows = items.map((item) => [
        dayjs(item.date).format('YYYY-MM-DD'), String(item.value),
      ]);

      saveAsCSV(headerRows, dataRows, `${ title } (Blockscout stats)`);
    }
  }, [ items, title ]);

  const hasItems = items && items.length > 2;

  const content = (() => {
    if (isError) {
      return (
        <Flex
          alignItems="center"
          justifyContent="center"
          flexGrow={ 1 }
          py={ 4 }
        >
          <Text
            variant="secondary"
            fontSize="sm"
            textAlign="center"
          >
            { `The data didn${ apos }t load. Please, ` }
            <Link href={ window.document.location.href }>try to reload the page.</Link>
          </Text>
        </Flex>
      );
    }

    if (isLoading) {
      return <Skeleton flexGrow={ 1 } w="100%"/>;
    }

    if (!hasItems) {
      return (
        <Center flexGrow={ 1 }>
          <Text variant="secondary" fontSize="sm">No data</Text>
        </Center>
      );
    }

    return (
      <Box flexGrow={ 1 } maxW="100%">
        <ChartWidgetGraph
          items={ items }
          onZoom={ handleZoom }
          isZoomResetInitial={ isZoomResetInitial }
          title={ title }
          units={ units }
        />
      </Box>
    );
  })();

  return (
    <>
      <Flex
        height="100%"
        ref={ ref }
        flexDir="column"
        padding={{ base: 3, lg: 4 }}
        borderRadius="md"
        border="1px"
        borderColor={ borderColor }
        className={ className }
      >
        <Flex columnGap={ 6 } mb={ 1 } alignItems="flex-start">
          <Flex flexGrow={ 1 } flexDir="column" alignItems="flex-start">
            <Skeleton
              isLoaded={ !isLoading }
              fontWeight={ 600 }
              size={{ base: 'xs', lg: 'sm' }}
            >
              { title }
            </Skeleton>

            { description && (
              <Skeleton
                isLoaded={ !isLoading }
                color="text_secondary"
                fontSize="xs"
                mt={ 1 }
              >
                <span>{ description }</span>
              </Skeleton>
            ) }
          </Flex>

          <Flex ml="auto" columnGap={ 2 }>
            <Tooltip label="Reset zoom">
              <IconButton
                hidden={ isZoomResetInitial }
                aria-label="Reset zoom"
                colorScheme="blue"
                w={ 9 }
                h={ 8 }
                size="sm"
                variant="outline"
                onClick={ handleZoomResetClick }
                icon={ <IconSvg name="repeat_arrow" w={ 4 } h={ 4 }/> }
              />
            </Tooltip>

            { hasItems && (
              <Menu>
                <Skeleton isLoaded={ !isLoading } borderRadius="base">
                  <MenuButton
                    w="36px"
                    h="32px"
                    icon={ <IconSvg name="dots" boxSize={ 4 } transform="rotate(-90deg)"/> }
                    colorScheme="gray"
                    variant="ghost"
                    as={ IconButton }
                  >
                    <VisuallyHidden>
                      Open chart options menu
                    </VisuallyHidden>
                  </MenuButton>
                </Skeleton>
                <MenuList>
                  <MenuItem
                    display="flex"
                    alignItems="center"
                    onClick={ showChartFullscreen }
                  >
                    <IconSvg name="scope" boxSize={ 5 } mr={ 3 }/>
                  View fullscreen
                  </MenuItem>

                  <MenuItem
                    display="flex"
                    alignItems="center"
                    onClick={ handleFileSaveClick }
                  >
                    <IconSvg name="files/image" boxSize={ 5 } mr={ 3 }/>
                  Save as PNG
                  </MenuItem>

                  <MenuItem
                    display="flex"
                    alignItems="center"
                    onClick={ handleSVGSavingClick }
                  >
                    <IconSvg name="files/csv" boxSize={ 5 } mr={ 3 }/>
                  Save as CSV
                  </MenuItem>
                </MenuList>
              </Menu>
            ) }
          </Flex>
        </Flex>

        { content }
      </Flex>

      { hasItems && (
        <FullscreenChartModal
          isOpen={ isFullscreen }
          items={ items }
          title={ title }
          description={ description }
          onClose={ clearFullscreenChart }
          units={ units }
        />
      ) }
    </>
  );
};

export default React.memo(chakra(ChartWidget));
