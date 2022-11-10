import { Text, Flex, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  name: string;
  value: string;
  isSelected: boolean;
  icon: React.ReactNode;
  onClick: (name: string) => void;
}

const ChainIndicatorItem = ({ name, value, icon, isSelected, onClick }: Props) => {
  const bgColor = useColorModeValue('white', 'gray.900');

  const handleClick = React.useCallback(() => {
    onClick(name);
  }, [ name, onClick ]);

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
        <Text fontFamily="Poppins" fontWeight={ 500 }>{ name }</Text>
        <Text variant="secondary" fontWeight={ 600 }>{ value }</Text>
      </Box>
    </Flex>
  );
};

export default React.memo(ChainIndicatorItem);
