import { Box, Button, Text, Skeleton, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { TWatchlist, TWatchlistItem } from 'types/client/account';

import AccountPageHeader from 'ui/shared/AccountPageHeader';
import Page from 'ui/shared/Page/Page';
import SkeletonTable from 'ui/shared/SkeletonTable';
import AddressModal from 'ui/watchlist/AddressModal/AddressModal';
import DeleteAddressModal from 'ui/watchlist/DeleteAddressModal';
import WatchlistTable from 'ui/watchlist/WatchlistTable/WatchlistTable';

const WatchList: React.FC = () => {
  const queryClient = useQueryClient();
  const watchlistData = queryClient.getQueryData([ 'watchlist' ]) as TWatchlist;

  const addressModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();

  const [ addressModalData, setAddressModalData ] = useState<TWatchlistItem>();
  const [ deleteModalData, setDeleteModalData ] = useState<TWatchlistItem>();

  const onEditClick = useCallback((data: TWatchlistItem) => {
    setAddressModalData(data);
    addressModalProps.onOpen();
  }, [ addressModalProps ]);

  const onAddressModalClose = useCallback(() => {
    setAddressModalData(undefined);
    addressModalProps.onClose();
  }, [ addressModalProps ]);

  const onDeleteClick = useCallback((data: TWatchlistItem) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  return (
    <Page>
      <Box h="100%">
        <AccountPageHeader text="Watch list"/>
        <Text marginBottom={ 12 }>An email notification can be sent to you when an address on your watch list sends or receives any transactions.</Text>
        { !watchlistData && (
          <>
            <SkeletonTable columns={ [ '70%', '30%', '160px', '108px' ] }/>
            <Skeleton height="44px" width="156px" marginTop={ 8 }/>
          </>
        ) }
        { Boolean(watchlistData?.length) && (
          <WatchlistTable
            data={ watchlistData }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        ) }
        { Boolean(watchlistData) && (
          <Box marginTop={ 8 }>
            <Button
              variant="primary"
              size="lg"
              onClick={ addressModalProps.onOpen }
            >
                Add address
            </Button>
          </Box>
        ) }
      </Box>
      <AddressModal { ...addressModalProps } onClose={ onAddressModalClose } data={ addressModalData }/>
      <DeleteAddressModal { ...deleteModalProps } onClose={ onDeleteModalClose } data={ deleteModalData }/>
    </Page>
  );
};

export default WatchList;
