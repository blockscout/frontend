import React from 'react';
import type { NextPage } from 'next';
import { Center } from '@chakra-ui/react';
import Page from '../components/Page/Page';

const WatchList: NextPage = () => {
  return (
    <Page>
      <Center h="100%" bgColor="white" color="black">
      Watch List Page
      </Center>
    </Page>
  );
};

export default WatchList
