import { GridItem, Icon, Flex, Tooltip, Box, Text } from '@chakra-ui/react';
import type { HTMLChakraProps } from '@chakra-ui/system';
import React from 'react';

import infoIcon from 'icons/info.svg';

interface Props extends HTMLChakraProps<'div'> {
  title: string;
  hint: string;
  children: React.ReactNode;
}

const DetailsInfoItem = ({ title, hint, children, ...styles }: Props) => {
  return (
    <>
      <GridItem py={{ base: 1, lg: 2 }} lineHeight={ 5 } { ...styles } whiteSpace="nowrap" _notFirst={{ mt: { base: 3, lg: 0 } }}>
        <Flex columnGap={ 2 } alignItems="center">
          <Tooltip
            label={ hint }
            placement="top"
            maxW="320px"
          >
            <Box cursor="pointer" display="inherit">
              <Icon as={ infoIcon } boxSize={ 5 }/>
            </Box>
          </Tooltip>
          <Text fontWeight={{ base: 700, lg: 500 }}>{ title }</Text>
        </Flex>
      </GridItem>
      <GridItem
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        rowGap={ 3 }
        pl={{ base: 7, lg: 0 }}
        py={{ base: 1, lg: 2 }}
        lineHeight={ 5 }
        whiteSpace="nowrap"
        { ...styles }
      >
        { children }
      </GridItem>
    </>
  );
};

export default DetailsInfoItem;
