import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';

import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';

import Page from '../components/Page/Page';

import WatchlistTable from '../components/WatchlistTable/WatchlistTable';
import AddressModal from '../components/AddressModal/AddressModal';

import type { TWatchlistItem } from '../data/watchlist';
import { watchlist } from '../data/watchlist';

const WatchList: NextPage = () => {
  const addressModalProps = useDisclosure();
  const [ data, setData ] = useState<TWatchlistItem>();

  const onEditClick = useCallback((index: number) => () => {
    setData(watchlist[index]);
    addressModalProps.onOpen();
  }, [ addressModalProps ])

  const onDeleteClick = useCallback((index: number) => () => {
    // eslint-disable-next-line no-console
    console.log('delete', index);
  }, [ ])

  const onModalClose = useCallback(() => {
    setData(undefined);
    addressModalProps.onClose();
  }, [ addressModalProps ]);

  return (
    <Page>
      <Box h="100%">
        <Text marginBottom="40px">An Email notification can be sent to you when an address on your watch list sends or receives any transactions.</Text>
        { Boolean(watchlist.length) && (
          <WatchlistTable
            data={ watchlist }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        ) }
        <Box marginTop="32px">
          <Button
            colorScheme="blue"
            onClick={ addressModalProps.onOpen }
          >
            Add address
          </Button>
        </Box>
      </Box>
      <AddressModal { ...addressModalProps } onClose={ onModalClose } data={ data }/>
    </Page>
  );
};

export default WatchList
