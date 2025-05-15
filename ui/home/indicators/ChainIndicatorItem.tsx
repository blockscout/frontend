import { Text, Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { ChainIndicatorId } from 'types/homepage';

import { Skeleton } from 'toolkit/chakra/skeleton';

interface Props {
  id: ChainIndicatorId;
  title: string;
  value?: string;
  valueDiff?: number | null | undefined;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: (id: ChainIndicatorId) => void;
  isLoading: boolean;
  hasData: boolean;
}

const ChainIndicatorItem = ({ id, title, value, valueDiff, icon, isSelected, onClick, isLoading, hasData }: Props) => {
  const handleClick = React.useCallback(() => {
    onClick(id);
  }, [ id, onClick ]);

  const valueContent = (() => {
    if (!hasData) {
      return <Text color="text.secondary" fontWeight={ 400 }>no data</Text>;
    }

    return (
      <Skeleton loading={ isLoading } fontWeight={ 600 } minW="30px">
        { value }
      </Skeleton>
    );
  })();

  const valueDiffContent = (() => {
    if (valueDiff === undefined || valueDiff === null) {
      return null;
    }

    const diffColor = valueDiff >= 0 ? 'green.500' : 'red.500';

    return (
      <Skeleton loading={ isLoading } ml={ 1 } display="flex" alignItems="center" color={ diffColor }>
        <span>{ valueDiff >= 0 ? '+' : '-' }</span>
        <Text color={ diffColor } fontWeight={ 600 }>{ Math.abs(valueDiff) }%</Text>
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
