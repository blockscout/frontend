import React from 'react';
import type { NextPage } from 'next';

import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';

import Page from '../components/Page/Page';

import WatchlistTable from '../components/WatchlistTable/WatchlistTable';
import AddressModal from '../components/AddressModal/AddressModal';

import { watchlist } from '../data/watchlist';

const WatchList: NextPage = () => {
  const addressModalProps = useDisclosure();
  return (
    <Page>
      <Box h="100%">
        <Text marginBottom="40px">An Email notification can be sent to you when an address on your watch list sends or receives any transactions.</Text>
        { Boolean(watchlist.length) && <WatchlistTable data={ watchlist }/> }
        <Box marginTop="32px">
          <Button
            colorScheme="blue"
            onClick={ addressModalProps.onOpen }
          >
            Add address
          </Button>
        </Box>
      </Box>
      <AddressModal { ...addressModalProps }/>
    </Page>
  );
};

export default WatchList
