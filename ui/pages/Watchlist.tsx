import React, { useCallback, useState } from 'react';

import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';

import Page from '../Page/Page';

import WatchlistTable from '../watchlist/WatchlistTable/WatchlistTable';
import AddressModal from '../watchlist/AddressModal/AddressModal';

import type { TWatchlistItem } from '../../data/watchlist';
import { watchlist } from '../../data/watchlist';
import DeleteAddressModal from '../watchlist/DeleteAddressModal';

const WatchList: React.FC = () => {
  const addressModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();

  const [ addressModalData, setAddressModalData ] = useState<TWatchlistItem>();
  const [ deleteModalData, setDeleteModalData ] = useState<string>();

  const onEditClick = useCallback((data: TWatchlistItem) => {
    setAddressModalData(data);
    addressModalProps.onOpen();
  }, [ addressModalProps ])

  const onAddressModalClose = useCallback(() => {
    setAddressModalData(undefined);
    addressModalProps.onClose();
  }, [ addressModalProps ]);

  const onDeleteClick = useCallback((data: TWatchlistItem) => {
    setDeleteModalData(data.address);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ])

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  return (
    <Page>
      <Box h="100%">
        <Box as="h1" textStyle="h2" marginBottom={ 8 }>Watch list</Box>
        <Text marginBottom={ 12 }>An email notification can be sent to you when an address on your watch list sends or receives any transactions.</Text>
        { Boolean(watchlist.length) && (
          <WatchlistTable
            data={ watchlist }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        ) }
        <Box marginTop={ 8 }>
          <Button
            variant="primary"
            size="lg"
            onClick={ addressModalProps.onOpen }
          >
            Add address
          </Button>
        </Box>
      </Box>
      <AddressModal { ...addressModalProps } onClose={ onAddressModalClose } data={ addressModalData }/>
      <DeleteAddressModal { ...deleteModalProps } onClose={ onDeleteModalClose } address={ deleteModalData }/>
    </Page>
  );
};

export default WatchList
