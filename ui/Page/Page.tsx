import React from 'react';
import { Box, HStack, LightMode, VStack } from '@chakra-ui/react';

import AccountNav from '../navigation/Navigation';
import Header from '../header/Header';

interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {
  return (
    <LightMode>
      <HStack
        w="100%"
        minH="100vh"
        padding="36px 60px 48px 40px"
        bgColor="white"
        spacing="12"
        alignItems="stretch"
      >
        <AccountNav/>
        <VStack>
          <Header/>
          <Box borderRadius="base" w="100%" overflow="hidden" bgColor="white" padding="32px 20px">{ children }</Box>
        </VStack>
      </HStack>
    </LightMode>
  );
};

export default Page
