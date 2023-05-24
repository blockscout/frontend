import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { TransactionTag } from 'types/api/account';

import useApiQuery from 'lib/api/useApiQuery';
import { PRIVATE_TAG_TX } from 'stubs/account';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import DeletePrivateTagModal from './DeletePrivateTagModal';
import TransactionModal from './TransactionModal/TransactionModal';
import TransactionTagListItem from './TransactionTagTable/TransactionTagListItem';
import TransactionTagTable from './TransactionTagTable/TransactionTagTable';

const PrivateTransactionTags = () => {
  const { data: transactionTagsData, isPlaceholderData, isError, error } = useApiQuery('private_tags_tx', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: Array(3).fill(PRIVATE_TAG_TX),
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

  if (isError) {
    if (error.status === 403) {
      throw new Error('Unverified email error', { cause: error });
    }
    return <DataFetchAlert/>;
  }

  const list = (
    <>
      <Box display={{ base: 'block', lg: 'none' }}>
        { transactionTagsData?.map((item, index) => (
          <TransactionTagListItem
            key={ item.id + (isPlaceholderData ? index : '') }
            item={ item }
            isLoading={ isPlaceholderData }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        )) }
      </Box>
      <Box display={{ base: 'none', lg: 'block' }}>
        <TransactionTagTable
          data={ transactionTagsData }
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
      { Boolean(transactionTagsData?.length) && list }
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
