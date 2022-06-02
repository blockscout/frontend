import React from 'react';
import { Box, HStack } from '@chakra-ui/react';

import Nav from '../Nav/Nav';

interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {
  return (
    <HStack
      w="100%"
      minH="100vh"
      padding="140px 48px 48px 48px"
      bgColor="gray.200"
      spacing="12"
      alignItems="stretch"
    >
      <Nav/>
      <Box borderRadius="10px" w="100%" overflow="hidden">{ children }</Box>
    </HStack>
  );
};

export default Page
