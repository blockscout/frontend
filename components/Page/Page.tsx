import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

import Nav from '../Nav/Nav';

interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {
  return (
    <Flex
      w="100%"
      minH="100vh"
      padding="140px 48px 48px 48px"
      bgColor="gray.200"
    >
      <Nav/>
      <Box borderRadius="10px" w="100%" overflow="hidden">{ children }</Box>
    </Flex>
  );
};

export default Page
