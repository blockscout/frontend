import { Box, Button, Skeleton, Text, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { TransactionTags, TransactionTag } from 'types/api/account';

import SkeletonTable from 'ui/shared/SkeletonTable';

import DeletePrivateTagModal from './DeletePrivateTagModal';
import TransactionModal from './TransactionModal/TransactionModal';
import TransactionTagTable from './TransactionTagTable/TransactionTagTable';

type Props = {
  transactionTags?: TransactionTags;
}

const PrivateTransactionTags = ({ transactionTags }: Props) => {
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
    <Text marginBottom={ 12 }>
        Use private transaction tags to label any transactions of interest.
        Private tags are saved in your account and are only visible when you are logged in.
    </Text>
  );

  if (!transactionTags) {
    return (
      <>
        { description }
        <SkeletonTable columns={ [ '75%', '25%', '108px' ] }/>
        <Skeleton height="44px" width="156px" marginTop={ 8 }/>
      </>
    );
  }

  return (
    <>
      { description }
      { Boolean(transactionTags.length) && (
        <TransactionTagTable
          data={ transactionTags }
          onDeleteClick={ onDeleteClick }
          onEditClick={ onEditClick }
        />
      ) }
      <Box marginTop={ 8 }>
        <Button
          variant="primary"
          size="lg"
          onClick={ transactionModalProps.onOpen }
        >
          Add transaction tag
        </Button>
      </Box>
      <TransactionModal { ...transactionModalProps } onClose={ onAddressModalClose } data={ transactionModalData }/>
      <DeletePrivateTagModal
        { ...deleteModalProps }
        onClose={ onDeleteModalClose }
        data={ deleteModalData }
        type="transaction"
      />
    </>
  );
};

export default PrivateTransactionTags;
