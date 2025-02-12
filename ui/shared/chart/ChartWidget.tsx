import { chakra, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useRef } from 'react';

import type { TimeChartItem } from './types';

import { route, type Route } from 'nextjs-routes';

import config from 'configs/app';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import ChartMenu from './ChartMenu';
import ChartWidgetContent from './ChartWidgetContent';
import useZoom from './useZoom';

export type Props = {
  items?: Array<TimeChartItem>;
  title: string;
  description?: string;
  units?: string;
  isLoading: boolean;
  className?: string;
  isError: boolean;
  emptyText?: string;
  noAnimation?: boolean;
  href?: Route;
};

const ChartWidget = ({
  items,
  title,
  description,
  isLoading,
  className,
  isError,
  units,
  emptyText,
  noAnimation,
  href,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { zoomRange, handleZoom, handleZoomReset } = useZoom();

  const hasItems = items && items.length > 2;

  const content = (
    <ChartWidgetContent
      items={ items }
      isError={ isError }
      isLoading={ isLoading }
      units={ units }
      title={ title }
      emptyText={ emptyText }
      handleZoom={ handleZoom }
      zoomRange={ zoomRange }
      noAnimation={ noAnimation }
    />
  );

  const chartHeader = (
    <Flex
      flexGrow={ 1 }
      flexDir="column"
      alignItems="flex-start"
      cursor={ href ? 'pointer' : 'default' }
      _hover={ href ? { color: 'link.primary.hovered' } : {} }
    >
      <Skeleton
        loading={ isLoading }
        fontWeight={ 600 }
        textStyle="md"
      >
        <span>{ title }</span>
      </Skeleton>

      { description && (
        <Skeleton
          loading={ isLoading }
          color="text_secondary"
          fontSize="xs"
          mt={ 1 }
        >
          <span>{ description }</span>
        </Skeleton>
      ) }
    </Flex>
  );

  return (
    <Flex
      height="100%"
      ref={ ref }
      flexDir="column"
      padding={{ base: 3, lg: 4 }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={{ _light: 'gray.200', _dark: 'gray.600' }}
      className={ className }
    >
      <Flex columnGap={ 6 } mb={ 2 } alignItems="flex-start">
        { href ? (
          <NextLink href={ href } passHref legacyBehavior >
            { chartHeader }
          </NextLink>
        ) : chartHeader }
        <Flex ml="auto" columnGap={ 2 }>
          <Tooltip content="Reset zoom">
            <IconButton
              hidden={ !zoomRange }
              aria-label="Reset zoom"
              w={ 9 }
              h={ 8 }
              size="sm"
              variant="outline"
              onClick={ handleZoomReset }
            >
              <IconSvg name="repeat" boxSize={ 4 }/>
            </IconButton>
          </Tooltip>

          { hasItems && (
            <ChartMenu
              items={ items }
              title={ title }
              description={ description }
              chartUrl={ href ? config.app.baseUrl + route(href) : undefined }
              isLoading={ isLoading }
              chartRef={ ref }
              units={ units }
              handleZoom={ handleZoom }
              handleZoomReset={ handleZoomReset }
              zoomRange={ zoomRange }
            />
          ) }
        </Flex>
      </Flex>

      { content }
    </Flex>
  );
};

export default React.memo(chakra(ChartWidget));
