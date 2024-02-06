import { Text, Flex, Box, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { HomeStats } from 'types/api/stats';
import type { ChainIndicatorId } from 'types/homepage';

import type { ResourceError } from 'lib/api/resources';
import useIsMobile from 'lib/hooks/useIsMobile';

interface Props {
  id: ChainIndicatorId;
  title: string;
  value: (stats: HomeStats) => string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: (id: ChainIndicatorId) => void;
  stats: UseQueryResult<HomeStats, ResourceError<unknown>>;
}

const ChainIndicatorItem = ({ id, title, value, icon, isSelected, onClick, stats }: Props) => {
  const isMobile = useIsMobile();

  const activeBgColorDesktop = useColorModeValue('white', 'gray.900');
  const activeBgColorMobile = useColorModeValue('white', 'black');
  const activeBgColor = isMobile ? activeBgColorMobile : activeBgColorDesktop;

  const handleClick = React.useCallback(() => {
    onClick(id);
  }, [ id, onClick ]);

  const valueContent = (() => {
    if (isMobile) {
      return null;
    }

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
        <Text fontFamily="heading" fontWeight={ 500 }>{ title }</Text>
        { valueContent }
      </Box>
    </Flex>
  );
};

export default React.memo(ChainIndicatorItem);
