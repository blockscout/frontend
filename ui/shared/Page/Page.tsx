import { Box, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import Header from 'ui/header/Header';
import Navigation from 'ui/navigation/Navigation';

interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {
  const isMobile = useIsMobile();

  return (
    <HStack
      w="100%"
      minH="100vh"
      alignItems="stretch"
    >
      <Navigation/>
      <VStack width="100%" paddingX={ isMobile ? 4 : 8 } paddingTop={ isMobile ? '104px' : 9 } paddingBottom={ 10 }>
        <Header/>
        <Box
          as="main"
          borderRadius="base"
          w="100%"
          overflow="hidden"
        >
          { children }
        </Box>
      </VStack>
    </HStack>
  );
};

export default Page;
