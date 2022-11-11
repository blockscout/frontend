import { Text, Flex, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { ChainIndicatorId } from './types';

interface Props {
  id: ChainIndicatorId;
  title: string;
  value: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: (id: ChainIndicatorId) => void;
}

const ChainIndicatorItem = ({ id, title, value, icon, isSelected, onClick }: Props) => {
  const bgColor = useColorModeValue('white', 'gray.900');

  const handleClick = React.useCallback(() => {
    onClick(id);
  }, [ id, onClick ]);

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
      boxShadow={ isSelected ? 'xl' : 'none' }
      zIndex={ isSelected ? 1 : 'initial' }
      _hover={{
        bgColor,
        zIndex: 1,
      }}
    >
      { icon }
      <Box>
        <Text fontFamily="heading" fontWeight={ 500 }>{ title }</Text>
        <Text variant="secondary" fontWeight={ 600 }>{ value }</Text>
      </Box>
    </Flex>
  );
};

export default React.memo(ChainIndicatorItem);
