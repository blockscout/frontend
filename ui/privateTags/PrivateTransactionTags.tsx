import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { TransactionTag } from 'types/api/account';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import SkeletonListAccount from 'ui/shared/skeletons/SkeletonListAccount';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';

import DeletePrivateTagModal from './DeletePrivateTagModal';
import TransactionModal from './TransactionModal/TransactionModal';
import TransactionTagListItem from './TransactionTagTable/TransactionTagListItem';
import TransactionTagTable from './TransactionTagTable/TransactionTagTable';

const PrivateTransactionTags = () => {
  const { data: transactionTagsData, isLoading, isError, error } = useApiQuery('private_tags_tx', { queryOptions: { refetchOnMount: false } });

  const transactionModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  const isMobile = useIsMobile();

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

  if (isLoading && !transactionTagsData) {
    const loader = isMobile ? <SkeletonListAccount/> : (
      <>
        <SkeletonTable columns={ [ '75%', '25%', '108px' ] }/>
        <Skeleton height="44px" width="156px" marginTop={ 8 }/>
      </>
    );

    return (
      <>
        { description }
        { loader }
      </>
    );
  }

  if (isError) {
    if (error.status === 403) {
      throw new Error('Unverified email error', { cause: error });
    }
    return <DataFetchAlert/>;
  }

  const list = isMobile ? (
    <Box>
      { transactionTagsData.map((item) => (
        <TransactionTagListItem
          item={ item }
          key={ item.id }
          onDeleteClick={ onDeleteClick }
          onEditClick={ onEditClick }
        />
      )) }
    </Box>
  ) : (
    <TransactionTagTable
      data={ transactionTagsData }
      onDeleteClick={ onDeleteClick }
      onEditClick={ onEditClick }
    />
  );

  return (
    <>
      { description }
      { Boolean(transactionTagsData.length) && list }
      <Box marginTop={ 8 }>
        <Button
          size="lg"
          onClick={ transactionModalProps.onOpen }
        >
          Add transaction tag
        </Button>
      </Box>
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
