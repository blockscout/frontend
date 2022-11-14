import { Text, Flex, Box, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { ChainIndicatorId } from './types';
import type { Stats } from 'types/api/stats';

interface Props {
  id: ChainIndicatorId;
  title: string;
  value: (stats: Stats) => string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: (id: ChainIndicatorId) => void;
  stats: UseQueryResult<Stats>;
}

const ChainIndicatorItem = ({ id, title, value, icon, isSelected, onClick, stats }: Props) => {
  const bgColor = useColorModeValue('white', 'gray.900');

  const handleClick = React.useCallback(() => {
    onClick(id);
  }, [ id, onClick ]);

  const valueContent = (() => {
    if (stats.isLoading) {
      return <Skeleton h={ 3 } w="70px" my={ 1.5 }/>;
    }

    if (stats.isError) {
      return <Text variant="secondary" fontWeight={ 400 }>no data</Text>;
    }

    return <Text variant="secondary" fontWeight={ 600 }>{ value(stats.data) }</Text>;
  })();

  return (
    <Flex
      alignItems="center"
      columnGap={ 3 }
      p={ 4 }
      as="li"
      borderRadius="md"
      cursor="pointer"
      onClick={ handleClick }
      bgColor={ isSelected ? bgColor : 'inherit' }
      boxShadow={ isSelected ? 'lg' : 'none' }
      zIndex={ isSelected ? 1 : 'initial' }
      _hover={{
        bgColor,
        zIndex: 1,
      }}
    >
      { icon }
      <Box>
        <Text fontFamily="heading" fontWeight={ 500 }>{ title }</Text>
        { valueContent }
      </Box>
    </Flex>
  );
};

export default React.memo(ChainIndicatorItem);
