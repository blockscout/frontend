import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { WatchlistAddress, WatchlistResponse } from 'types/api/account';

import { resourceKey } from 'lib/api/resources';
import { getResourceKey } from 'lib/api/useApiQuery';
import { WATCH_LIST_ITEM_WITH_TOKEN_INFO } from 'stubs/account';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';
import AddressModal from 'ui/watchlist/AddressModal/AddressModal';
import DeleteAddressModal from 'ui/watchlist/DeleteAddressModal';
import WatchListItem from 'ui/watchlist/WatchlistTable/WatchListItem';
import WatchlistTable from 'ui/watchlist/WatchlistTable/WatchlistTable';

const WatchList: React.FC = () => {

  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'watchlist',
    options: {
      placeholderData: { items: Array(5).fill(WATCH_LIST_ITEM_WITH_TOKEN_INFO), next_page_params: null },
    },
  });
  const queryClient = useQueryClient();
  const profileQuery = useProfileQuery();

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
    queryClient.setQueryData(getResourceKey('watchlist'), (prevData: WatchlistResponse | undefined) => {
      const newItems = prevData?.items.filter((item: WatchlistAddress) => item.id !== deleteModalData?.id);
      return { ...prevData, items: newItems };
    },
    );
  }, [ deleteModalData?.id, queryClient ]);

  const description = (
    <AccountPageDescription>
      An email notification can be sent to you when an address on your watch list sends or receives any transactions.
    </AccountPageDescription>
  );

  const content = (() => {
    const actionBar = pagination.isVisible ? (
      <ActionBar mt={ -6 }>
        <Pagination ml="auto" { ...pagination }/>
      </ActionBar>
    ) : null;

    const list = (
      <>
        <Box display={{ base: 'block', lg: 'none' }}>
          { data?.items.map((item, index) => (
            <WatchListItem
              key={ item.address_hash + (isPlaceholderData ? index : '') }
              item={ item }
              isLoading={ isPlaceholderData }
              onDeleteClick={ onDeleteClick }
              onEditClick={ onEditClick }
              hasEmail={ Boolean(profileQuery.data?.email) }
            />
          )) }
        </Box>
        <Box display={{ base: 'none', lg: 'block' }}>
          <WatchlistTable
            data={ data?.items }
            isLoading={ isPlaceholderData }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
            top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
            hasEmail={ Boolean(profileQuery.data?.email) }
          />
        </Box>
      </>
    );

    return (
      <>
        { description }
        <DataListDisplay
          isError={ isError }
          items={ data?.items }
          emptyText=""
          content={ list }
          actionBar={ actionBar }
        />
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
