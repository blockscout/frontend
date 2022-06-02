import React from 'react';
import { Box, HStack } from '@chakra-ui/react';

import AccountNav from '../AccountNav/AccountNav';

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
      <AccountNav/>
      <Box borderRadius="10px" w="100%" overflow="hidden">{ children }</Box>
    </HStack>
  );
};

export default Page
