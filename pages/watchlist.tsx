import React from 'react';
import type { NextPage } from 'next';

import { Center } from '@chakra-ui/react';

import Page from '../components/Page/Page';

import WatchlistTable from '../components/WatchlistTable/WatchlistTable';

import { watchlist } from '../data/watchlist';

const WatchList: NextPage = () => {
  return (
    <Page>
      <Center h="100%">
        <WatchlistTable data={ watchlist }/>
      </Center>
    </Page>
  );
};

export default WatchList
