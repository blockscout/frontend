import { Text, Flex, Box, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { HomeStats } from 'types/api/stats';
import type { ChainIndicatorId } from 'types/homepage';

import type { ResourceError } from 'lib/api/resources';
import IconSvg from 'ui/shared/IconSvg';

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
  const activeBgColor = useColorModeValue('white', 'black');

  const handleClick = React.useCallback(() => {
    onClick(id);
  }, [ id, onClick ]);

  const valueContent = (() => {
    if (!stats.data) {
      return <Text variant="secondary" fontWeight={ 400 }>no data</Text>;
    }

    return (
      <Skeleton isLoaded={ !stats.isPlaceholderData } variant="secondary" fontWeight={ 600 } minW="30px">
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
      <Skeleton isLoaded={ !stats.isPlaceholderData } ml={ 3 } display="flex" alignItems="center" color={ diffColor }>
        <IconSvg name="up" boxSize={ 5 } mr={ 1 } transform={ diff < 0 ? 'rotate(180deg)' : 'rotate(0)' }/>
        <Text color={ diffColor } fontWeight={ 600 }>{ diff }%</Text>
      </Skeleton>
    );
  })();

  return (
    <Flex
      alignItems="center"
      columnGap={ 2 }
      px={{ base: '6px', lg: 2 }}
      py="6px"
      as="li"
      borderRadius="base"
      cursor="pointer"
      bgColor={ isSelected ? activeBgColor : undefined }
      onClick={ handleClick }
      fontSize="xs"
      fontWeight={ 500 }
      _hover={{
        activeBgColor,
        zIndex: 1,
      }}
    >
      { icon }
      <Box display={{ base: 'none', lg: 'block' }}>
        <Text>{ title }</Text>
        <Flex alignItems="center">
          { valueContent }
          { valueDiffContent }
        </Flex>
      </Box>
    </Flex>
  );
};

export default React.memo(ChainIndicatorItem);
