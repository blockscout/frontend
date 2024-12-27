import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { TransactionTag } from 'types/api/account';

import { PRIVATE_TAG_TX } from 'stubs/account';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import DeletePrivateTagModal from './DeletePrivateTagModal';
import TransactionModal from './TransactionModal/TransactionModal';
import TransactionTagListItem from './TransactionTagTable/TransactionTagListItem';
import TransactionTagTable from './TransactionTagTable/TransactionTagTable';

const PrivateTransactionTags = () => {
  const { data: transactionTagsData, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'private_tags_tx',
    options: {
      refetchOnMount: false,
      placeholderData: { items: Array(3).fill(PRIVATE_TAG_TX), next_page_params: null },
    },
  });

  const transactionModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();

  const [ transactionModalData, setTransactionModalData ] = useState<TransactionTag>();
  const [ deleteModalData, setDeleteModalData ] = useState<TransactionTag>();

  const onEditClick = useCallback((data: TransactionTag) => {
    setTransactionModalData(data);
    transactionModalProps.onOpen();
  }, [ transactionModalProps ]);

  const onAddressModalClose = useCallback(() => {
    setTransactionModalData(undefined);
    transactionModalProps.onClose();
  }, [ transactionModalProps ]);

  const onDeleteClick = useCallback((data: TransactionTag) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const description = (
    <AccountPageDescription>
      Use private transaction tags to label any transactions of interest.
      Private tags are saved in your account and are only visible when you are logged in.
    </AccountPageDescription>
  );

  const list = (
    <>
      <Box display={{ base: 'block', lg: 'none' }}>
        { transactionTagsData?.items.map((item, index) => (
          <TransactionTagListItem
            key={ item.id + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        )) }
      </Box>
      <Box display={{ base: 'none', lg: 'block' }}>
        <TransactionTagTable
          data={ transactionTagsData?.items }
          isLoading={ isPlaceholderData }
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
      { description }
      <DataListDisplay
        isError={ isError }
        items={ transactionTagsData?.items }
        emptyText=""
        content={ list }
        actionBar={ actionBar }
      />
      <Skeleton mt={ 8 } isLoaded={ !isPlaceholderData } display="inline-block">
        <Button
          size="lg"
          onClick={ transactionModalProps.onOpen }
        >
          Add transaction tag
        </Button>
      </Skeleton>
      <TransactionModal { ...transactionModalProps } onClose={ onAddressModalClose } data={ transactionModalData }/>
      { deleteModalData && (
        <DeletePrivateTagModal
          { ...deleteModalProps }
          onClose={ onDeleteModalClose }
          data={ deleteModalData }
          type="transaction"
        />
      ) }
    </>
  );
};

export default PrivateTransactionTags;
