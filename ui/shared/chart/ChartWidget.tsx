import { chakra, Flex } from '@chakra-ui/react';
import React, { useRef } from 'react';

import type { TimeChartItem } from './types';

import { route, type Route } from 'nextjs-routes';

import config from 'configs/app';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Link } from 'toolkit/chakra/link';
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
          color="text.secondary"
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
          <Link href={ route(href) } variant="plain">
            { chartHeader }
          </Link>
        ) : chartHeader }
        <Flex ml="auto" columnGap={ 2 }>
          <Tooltip content="Reset zoom">
            <IconButton
              hidden={ !zoomRange }
              aria-label="Reset zoom"
              size="md"
              variant="icon_secondary"
              onClick={ handleZoomReset }
            >
              <IconSvg name="repeat"/>
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
