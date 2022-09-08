import { GridItem, Icon, Flex, Tooltip, Box, Text } from '@chakra-ui/react';
import React from 'react';

import infoIcon from 'icons/info.svg';

interface Props {
  title: string;
  hint: string;
  children: React.ReactNode;
}

const DetailsInfoItem = ({ title, hint, children }: Props) => {
  return (
    <>
      <GridItem>
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
          <Text fontWeight={ 500 } whiteSpace="nowrap">{ title }</Text>
        </Flex>
      </GridItem>
      <GridItem display="flex" alignItems="center">{ children }</GridItem>
    </>
  );
};

export default DetailsInfoItem;
