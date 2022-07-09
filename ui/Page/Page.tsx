import React from 'react';
import { Box, HStack, LightMode, VStack } from '@chakra-ui/react';

import Navigation from '../navigation/Navigation';
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
        bgColor="white"
        spacing={ 16 }
        alignItems="stretch"
        paddingRight="60px"
      >
        <Navigation/>
        <VStack width="100%">
          <Header/>
          <Box
            as="main"
            borderRadius="base"
            w="100%"
            overflow="hidden"
            bgColor="white"
            py={ 8 }
          >
            { children }
          </Box>
        </VStack>
      </HStack>
    </LightMode>
  );
};

export default Page
