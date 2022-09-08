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
      <GridItem py={ 2 } lineHeight={ 5 } { ...styles } whiteSpace="nowrap">
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
          <Text fontWeight={ 500 }>{ title }</Text>
        </Flex>
      </GridItem>
      <GridItem display="flex" alignItems="center" py={ 2 } lineHeight={ 5 } whiteSpace="nowrap" { ...styles }>
        { children }
      </GridItem>
    </>
  );
};

export default DetailsInfoItem;
