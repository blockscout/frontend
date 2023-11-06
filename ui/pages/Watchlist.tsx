import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { WatchlistAddress } from 'types/api/account';

import { resourceKey } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import { WATCH_LIST_ITEM_WITH_TOKEN_INFO } from 'stubs/account';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';
import AddressModal from 'ui/watchlist/AddressModal/AddressModal';
import DeleteAddressModal from 'ui/watchlist/DeleteAddressModal';
import WatchListItem from 'ui/watchlist/WatchlistTable/WatchListItem';
import WatchlistTable from 'ui/watchlist/WatchlistTable/WatchlistTable';

const WatchList: React.FC = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('watchlist', {
    queryOptions: {
      placeholderData: Array(3).fill(WATCH_LIST_ITEM_WITH_TOKEN_INFO),
    },
  });
  const queryClient = useQueryClient();

  const addressModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  useRedirectForInvalidAuthToken();

  const [ addressModalData, setAddressModalData ] = useState<WatchlistAddress>();
  const [ deleteModalData, setDeleteModalData ] = useState<WatchlistAddress>();

  const onEditClick = useCallback((data: WatchlistAddress) => {
    setAddressModalData(data);
    addressModalProps.onOpen();
  }, [ addressModalProps ]);

  const onAddressModalClose = useCallback(() => {
    setAddressModalData(undefined);
    addressModalProps.onClose();
  }, [ addressModalProps ]);

  const onAddOrEditSuccess = useCallback(async() => {
    await queryClient.refetchQueries({ queryKey: [ resourceKey('watchlist') ] });
    setAddressModalData(undefined);
    addressModalProps.onClose();
  }, [ addressModalProps, queryClient ]);

  const onDeleteClick = useCallback((data: WatchlistAddress) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const onDeleteSuccess = useCallback(async() => {
    queryClient.setQueryData([ resourceKey('watchlist') ], (prevData: Array<WatchlistAddress> | undefined) => {
      return prevData?.filter((item) => item.id !== deleteModalData?.id);
    });
  }, [ deleteModalData?.id, queryClient ]);

  const description = (
    <AccountPageDescription>
      An email notification can be sent to you when an address on your watch list sends or receives any transactions.
    </AccountPageDescription>
  );

  if (isError) {
    return <DataFetchAlert/>;
  }

  const content = (() => {
    const list = (
      <>
        <Box display={{ base: 'block', lg: 'none' }}>
          { data?.map((item, index) => (
            <WatchListItem
              key={ item.address_hash + (isPlaceholderData ? index : '') }
              item={ item }
              isLoading={ isPlaceholderData }
              onDeleteClick={ onDeleteClick }
              onEditClick={ onEditClick }
            />
          )) }
        </Box>
        <Box display={{ base: 'none', lg: 'block' }}>
          <WatchlistTable
            data={ data }
            isLoading={ isPlaceholderData }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        </Box>
      </>
    );

    return (
      <>
        { description }
        { Boolean(data?.length) && list }
        <Skeleton mt={ 8 } isLoaded={ !isPlaceholderData } display="inline-block">
          <Button
            size="lg"
            onClick={ addressModalProps.onOpen }
          >
            Add address
          </Button>
        </Skeleton>
        <AddressModal
          { ...addressModalProps }
          onClose={ onAddressModalClose }
          onSuccess={ onAddOrEditSuccess }
          data={ addressModalData }
          isAdd={ !addressModalData }
        />
        { deleteModalData && (
          <DeleteAddressModal
            { ...deleteModalProps }
            onClose={ onDeleteModalClose }
            onSuccess={ onDeleteSuccess }
            data={ deleteModalData }
          />
        ) }
      </>
    );
  })();

  return (
    <>
      <PageTitle title="Watch list"/>
      { content }
    </>
  );
};

export default WatchList;
