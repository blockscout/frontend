import { Box, HStack, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import * as cookies from 'lib/cookies';
import useFetch from 'lib/hooks/useFetch';
import Header from 'ui/snippets/header/Header';
import NavigationDesktop from 'ui/snippets/navigation/NavigationDesktop';

interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {
  const router = useRouter();
  const fetch = useFetch();

  const networkType = router.query.network_type;
  const networkSubType = router.query.network_sub_type;

  useQuery<unknown, unknown, unknown>([ 'csrf' ], async() => await fetch('/api/account/csrf'));

  React.useEffect(() => {
    if (typeof networkType === 'string') {
      cookies.set(cookies.NAMES.NETWORK_TYPE, networkType);
    }
    if (typeof networkSubType === 'string') {
      cookies.set(cookies.NAMES.NETWORK_SUB_TYPE, networkSubType);
    }
  }, [ networkType, networkSubType ]);

  return (
    <HStack
      w="100%"
      minH="100vh"
      alignItems="stretch"
    >
      <NavigationDesktop/>
      <VStack
        width="100%"
        paddingX={{ base: 4, lg: 8 }}
        paddingTop={{ base: 0, lg: 9 }}
        paddingBottom={ 10 }
        spacing={ 0 }
      >
        <Header/>
        <Box
          as="main"
          w="100%"
          paddingTop={{ base: '138px', lg: '52px' }}
        >
          { children }
        </Box>
      </VStack>
    </HStack>
  );
};

export default Page;
