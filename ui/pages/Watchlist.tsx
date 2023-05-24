import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { WatchlistAddress, WatchlistTokensResponse } from 'types/api/account';
import type { TWatchlist, TWatchlistItem } from 'types/client/account';

import type { ResourceError } from 'lib/api/resources';
import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
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
  const apiFetch = useApiFetch();
  const { data, isPlaceholderData, isError, error } = useQuery<unknown, ResourceError, TWatchlist>(
    [ resourceKey('watchlist') ],
    async() => {
      const watchlistAddresses = await apiFetch<'watchlist', Array<WatchlistAddress>>('watchlist');

      if (!Array.isArray(watchlistAddresses)) {
        return;
      }

      const watchlistTokens = await Promise.all(watchlistAddresses.map(({ address }) => {
        if (!address?.hash) {
          return Promise.resolve(0);
        }
        return apiFetch<'old_api', WatchlistTokensResponse>('old_api', { queryParams: { address: address.hash, module: 'account', action: 'tokenlist' } })
          .then((response) => {
            if ('result' in response && Array.isArray(response.result)) {
              return response.result.length;
            }
            return 0;
          });
      }));

      return watchlistAddresses.map((item, index) => ({ ...item, tokens_count: watchlistTokens[index] }));
    },
    {
      placeholderData: Array(3).fill(WATCH_LIST_ITEM_WITH_TOKEN_INFO),
    },
  );
  const queryClient = useQueryClient();

  const addressModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  useRedirectForInvalidAuthToken();

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

  const onAddOrEditSuccess = useCallback(async() => {
    await queryClient.refetchQueries([ resourceKey('watchlist') ]);
    setAddressModalData(undefined);
    addressModalProps.onClose();
  }, [ addressModalProps, queryClient ]);

  const onDeleteClick = useCallback((data: TWatchlistItem) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const onDeleteSuccess = useCallback(async() => {
    queryClient.setQueryData([ resourceKey('watchlist') ], (prevData: TWatchlist | undefined) => {
      return prevData?.filter((item) => item.id !== deleteModalData?.id);
    });
  }, [ deleteModalData?.id, queryClient ]);

  const description = (
    <AccountPageDescription>
      An email notification can be sent to you when an address on your watch list sends or receives any transactions.
    </AccountPageDescription>
  );

  if (isError) {
    if (error.status === 403) {
      throw new Error('Unverified email error', { cause: error });
    }
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
