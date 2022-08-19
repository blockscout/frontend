import type { AlertStatus } from '@chakra-ui/react';
import { Center, Button, VStack, HStack, Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import useToast from 'lib/hooks/useToast';
import Page from 'ui/shared/Page/Page';

const Home: NextPage = () => {
  const router = useRouter();
  const toast = useToast();

  const openToast = (status: AlertStatus) => () => {
    toast({
      title: 'Account created.',
      description: 'We\'ve created your account for you.',
      status,
    });
  };

  return (
    <Page>
      <Center h="100%">
        <VStack gap={ 4 }>
          <Box>home page for { router.query.network_type } { router.query.network_sub_type } network</Box>
          <HStack>
            <Button onClick={ openToast('info') } > Show Info </Button>
            <Button onClick={ openToast('error') } > Show Error </Button>
            <Button onClick={ openToast('warning') } > Show Warning </Button>
            <Button onClick={ openToast('success') } > Show Success </Button>
          </HStack>
        </VStack>
      </Center>
    </Page>
  );
};

export default Home;
