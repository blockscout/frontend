import { Text, Flex, Box } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { HomeStats } from 'types/api/stats';
import type { ChainIndicatorId } from 'types/homepage';

import type { ResourceError } from 'lib/api/resources';
import { Skeleton } from 'toolkit/chakra/skeleton';

interface Props {
  id: ChainIndicatorId;
  title: string;
  value: (stats: HomeStats) => string;
  valueDiff?: (stats?: HomeStats) => number | null | undefined;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: (id: ChainIndicatorId) => void;
  stats: UseQueryResult<HomeStats, ResourceError<unknown>>;
}

const ChainIndicatorItem = ({ id, title, value, valueDiff, icon, isSelected, onClick, stats }: Props) => {
  const handleClick = React.useCallback(() => {
    onClick(id);
  }, [ id, onClick ]);

  const valueContent = (() => {
    if (!stats.data) {
      return <Text color="text.secondary" fontWeight={ 400 }>no data</Text>;
    }

    return (
      <Skeleton loading={ stats.isPlaceholderData } fontWeight={ 600 } minW="30px">
        { value(stats.data) }
      </Skeleton>
    );
  })();

  const valueDiffContent = (() => {
    if (!valueDiff) {
      return null;
    }
    const diff = valueDiff(stats.data);
    if (diff === undefined || diff === null) {
      return null;
    }

    const diffColor = diff >= 0 ? 'green.500' : 'red.500';

    return (
      <Skeleton loading={ stats.isPlaceholderData } ml={ 1 } display="flex" alignItems="center" color={ diffColor }>
        <span>{ diff >= 0 ? '+' : '-' }</span>
        <Text color={ diffColor } fontWeight={ 600 }>{ Math.abs(diff) }%</Text>
      </Skeleton>
    );
  })();

  return (
    <Flex
      alignItems="center"
      columnGap={ 2 }
      flexGrow={{ base: 0, lg: 1 }}
      px={{ base: '6px', lg: 2 }}
      py="6px"
      as="li"
      borderRadius="base"
      cursor="pointer"
      color={ isSelected ? { _light: 'gray.500', _dark: 'gray.400' } : 'link' }
      bgColor={ isSelected ? { _light: 'white', _dark: 'black' } : undefined }
      onClick={ handleClick }
      fontSize="xs"
      fontWeight={ 500 }
      _hover={{
        bgColor: { _light: 'white', _dark: 'black' },
        color: isSelected ? { _light: 'gray.500', _dark: 'gray.400' } : 'link.primary.hover',
        zIndex: 1,
      }}
    >
      { icon }
      <Box display={{ base: 'none', lg: 'block' }}>
        <span>{ title }</span>
        <Flex alignItems="center" color="text">
          { valueContent }
          { valueDiffContent }
        </Flex>
      </Box>
    </Flex>
  );
};

export default React.memo(ChainIndicatorItem);
