import {
  chakra,
  Flex,
  IconButton,
  Skeleton,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useRef } from 'react';

import type { TimeChartItem } from './types';

import type { Route } from 'nextjs-routes';

import IconSvg from 'ui/shared/IconSvg';

import ChartMenu from './ChartMenu';
import ChartWidgetContent from './ChartWidgetContent';
import useZoomReset from './useZoomReset';

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
}

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
  const { isZoomResetInitial, handleZoom, handleZoomReset } = useZoomReset();

  const borderColor = useColorModeValue('gray.200', 'gray.600');

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
      isZoomResetInitial={ isZoomResetInitial }
      noAnimation={ noAnimation }
    />
  );

  return (
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
            cursor={ href ? 'pointer' : 'default' }
            _hover={ href ? { color: 'link_hovered' } : {} }
          >
            { href ? (
              <NextLink href={ href } passHref legacyBehavior>
                { title }
              </NextLink>
            ) : title
            }
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
              onClick={ handleZoomReset }
              icon={ <IconSvg name="repeat" w={ 4 } h={ 4 }/> }
            />
          </Tooltip>

          { hasItems && (
            <ChartMenu
              items={ items }
              title={ title }
              description={ description }
              href={ href }
              isLoading={ isLoading }
              chartRef={ ref }
              units={ units }
            />
          ) }
        </Flex>
      </Flex>

      { content }
    </Flex>
  );
};

export default React.memo(chakra(ChartWidget));
