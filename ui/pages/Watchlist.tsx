import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { TWatchlist, TWatchlistItem } from 'types/client/account';
import { QueryKeys } from 'types/client/accountQueries';

import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import SkeletonListAccount from 'ui/shared/skeletons/SkeletonListAccount';
import SkeletonTable from 'ui/shared/SkeletonTable';
import AddressModal from 'ui/watchlist/AddressModal/AddressModal';
import DeleteAddressModal from 'ui/watchlist/DeleteAddressModal';
import WatchListItem from 'ui/watchlist/WatchlistTable/WatchListItem';
import WatchlistTable from 'ui/watchlist/WatchlistTable/WatchlistTable';

const WatchList: React.FC = () => {
  const { data, isLoading, isError } =
    useQuery<unknown, unknown, TWatchlist>([ QueryKeys.watchlist ], async() => fetch('/node-api/account/watchlist/get-with-tokens'));
  const queryClient = useQueryClient();

  const addressModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  const isMobile = useIsMobile();
  const fetch = useFetch();
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
    await queryClient.refetchQueries([ QueryKeys.watchlist ]);
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
    queryClient.setQueryData([ QueryKeys.watchlist ], (prevData: TWatchlist | undefined) => {
      return prevData?.filter((item) => item.id !== deleteModalData?.id);
    });
  }, [ deleteModalData?.id, queryClient ]);

  const description = (
    <AccountPageDescription>
      An email notification can be sent to you when an address on your watch list sends or receives any transactions.
    </AccountPageDescription>
  );

  let content;
  if (isLoading && !data) {
    const loader = isMobile ? <SkeletonListAccount showFooterSlot/> : (
      <>
        <SkeletonTable columns={ [ '70%', '30%', '160px', '108px' ] }/>
        <Skeleton height="44px" width="156px" marginTop={ 8 }/>
      </>
    );

    content = (
      <>
        { description }
        { loader }
      </>
    );
  } else if (isError) {
    content = <DataFetchAlert/>;
  } else {
    const list = isMobile ? (
      <Box>
        { data.map((item) => (
          <WatchListItem
            item={ item }
            key={ item.address_hash }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        )) }
      </Box>
    ) : (
      <WatchlistTable
        data={ data }
        onDeleteClick={ onDeleteClick }
        onEditClick={ onEditClick }
      />
    );

    content = (
      <>
        { description }
        { Boolean(data?.length) && list }
        <Box marginTop={ 8 }>
          <Button
            size="lg"
            onClick={ addressModalProps.onOpen }
          >
                Add address
          </Button>
        </Box>
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
  }

  return (
    <Page>
      <Box h="100%">
        <PageTitle text="Watch list"/>
        { content }
      </Box>
    </Page>
  );
};

export default WatchList;
