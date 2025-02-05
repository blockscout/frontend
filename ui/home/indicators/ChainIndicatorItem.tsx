import { Text, Flex, Box, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { HomeStats } from 'types/api/stats';
import type { ChainIndicatorId } from 'types/homepage';

import type { ResourceError } from 'lib/api/resources';
import useIsMobile from 'lib/hooks/useIsMobile';
import Skeleton from 'ui/shared/chakra/Skeleton';

interface Props {
  id: ChainIndicatorId;
  title: string;
  value: (stats: HomeStats) => string;
  valueDiff?: (stats?: HomeStats) => number | null | undefined;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick?: (id: ChainIndicatorId) => void;
  stats: UseQueryResult<HomeStats, ResourceError<unknown>>;
}

const ChainIndicatorItem = ({
  id,
  title,
  value,
  valueDiff,
  icon,
  isSelected,
  onClick,
  stats,
}: Props) => {
  const isMobile = useIsMobile();

  const activeBgColorDesktop = useColorModeValue('white', 'gray.900');
  const activeBgColorMobile = useColorModeValue('white', 'black');
  const activeBgColor = isMobile ? activeBgColorMobile : activeBgColorDesktop;

  const handleClick = React.useCallback(() => {
    if (onClick === undefined) {
      return;
    }

    onClick(id);
  }, [ id, onClick ]);

  const valueContent = (() => {
    // if (isMobile) {
    //   return null;
    // }

    if (stats.isPlaceholderData) {
      return (
        <Skeleton
          h={ 3 }
          w="70px"
          my={ 1.5 }
          // ssr: isMobile = undefined, isLoading = true
          display={{ base: 'none', lg: 'block' }}
        />
      );
    }

    if (!stats.data) {
      return (
        <Text variant="secondary" fontWeight={ 400 }>
          no data
        </Text>
      );
    }

    return (
      <Text variant="secondary" fontWeight={ 600 }>
        { value(stats.data) }
      </Text>
    );
  })();

  const valueDiffContent = (() => {
    if (isMobile || !valueDiff) {
      return null;
    }
    const diff = valueDiff(stats.data);
    if (diff === undefined || diff === null) {
      return null;
    }

    const diffColor = diff >= 0 ? 'green.500' : 'red.500';

    return (
      <Skeleton isLoaded={ !stats.isPlaceholderData } ml={ 1 } display="flex" alignItems="center" color={ diffColor }>
        <span>{ diff >= 0 ? '+' : '-' }</span>
        <Text color={ diffColor } fontWeight={ 600 }>{ Math.abs(diff) }%</Text>
      </Skeleton>
    );
  })();

  return (
    <Flex
      alignItems="center"
      columnGap={ 3 }
      px={ 4 }
      py={ 2 }
      as="li"
      borderRadius="md"
      cursor="pointer"
      onClick={ handleClick }
      bgColor={ isSelected ? activeBgColor : 'inherit' }
      boxShadow={ isSelected ? 'lg' : 'none' }
      zIndex={ isSelected ? 1 : 'initial' }
      _hover={{
        activeBgColor,
        zIndex: 1,
      }}
    >
      { icon }
      <Box>
        <Text fontFamily="heading" fontWeight={ 500 }>
          { title }
        </Text>
        <Flex alignItems="center">
          { valueContent }
          { valueDiffContent }
        </Flex>
      </Box>
    </Flex>
  );
};

export default React.memo(ChainIndicatorItem);
