import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { AddressTag } from 'types/api/account';

import { PAGE_TYPE_DICT } from 'lib/mixpanel/getPageType';
import { PRIVATE_TAG_ADDRESS } from 'stubs/account';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import AddressModal from './AddressModal/AddressModal';
import AddressTagListItem from './AddressTagTable/AddressTagListItem';
import AddressTagTable from './AddressTagTable/AddressTagTable';
import DeletePrivateTagModal from './DeletePrivateTagModal';

const PrivateAddressTags = () => {
  const { data: addressTagsData, isError, isPlaceholderData, refetch, pagination } = useQueryWithPages({
    resourceName: 'private_tags_address',
    options: {
      refetchOnMount: false,
      placeholderData: { items: Array(5).fill(PRIVATE_TAG_ADDRESS), next_page_params: null },
    },
  });

  const addressModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();

  const [ addressModalData, setAddressModalData ] = useState<AddressTag>();
  const [ deleteModalData, setDeleteModalData ] = useState<AddressTag>();

  const onEditClick = useCallback((data: AddressTag) => {
    setAddressModalData(data);
    addressModalProps.onOpen();
  }, [ addressModalProps ]);

  const onAddOrEditSuccess = useCallback(async() => {
    await refetch();
  }, [ refetch ]);

  const onAddressModalClose = useCallback(() => {
    setAddressModalData(undefined);
    addressModalProps.onClose();
  }, [ addressModalProps ]);

  const onDeleteClick = useCallback((data: AddressTag) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const list = (
    <>
      <Box display={{ base: 'block', lg: 'none' }}>
        { addressTagsData?.items.map((item: AddressTag, index: number) => (
          <AddressTagListItem
            item={ item }
            key={ item.id + (isPlaceholderData ? String(index) : '') }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Box>
      <Box display={{ base: 'none', lg: 'block' }}>
        <AddressTagTable
          isLoading={ isPlaceholderData }
          data={ addressTagsData?.items }
          onDeleteClick={ onDeleteClick }
          onEditClick={ onEditClick }
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
        />
      </Box>
    </>
  );

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <>
      <AccountPageDescription>
        Use private address tags to track any addresses of interest.
        Private tags are saved in your account and are only visible when you are logged in.
      </AccountPageDescription>
      <DataListDisplay
        isError={ isError }
        items={ addressTagsData?.items }
        emptyText=""
        content={ list }
        actionBar={ actionBar }
      />
      <Skeleton mt={ 8 } isLoaded={ !isPlaceholderData } display="inline-block">
        <Button
          size="lg"
          onClick={ addressModalProps.onOpen }
        >
          Add address tag
        </Button>
      </Skeleton>
      <AddressModal
        { ...addressModalProps }
        data={ addressModalData }
        pageType={ PAGE_TYPE_DICT['/account/tag-address'] }
        onClose={ onAddressModalClose }
        onSuccess={ onAddOrEditSuccess }
      />
      { deleteModalData && (
        <DeletePrivateTagModal
          { ...deleteModalProps }
          onClose={ onDeleteModalClose }
          data={ deleteModalData }
          type="address"
        />
      ) }
    </>
  );
};

export default PrivateAddressTags;
