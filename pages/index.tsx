import React from 'react';
import type { NextPage } from 'next';
import { Center } from '@chakra-ui/react';
import Page from 'ui/shared/Page/Page';

const Home: NextPage = () => {
  return (
    <Page>
      <Center h="100%">
        Home Page
      </Center>
    </Page>
  );
};

export default Home
