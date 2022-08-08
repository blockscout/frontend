import React, { useCallback, useState } from 'react';

import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';

import type { TransactionTags, TransactionTag } from 'types/api/account';

import TransactionTagTable from './TransactionTagTable/TransactionTagTable';
import TransactionModal from './TransactionModal/TransactionModal';

import DeletePrivateTagModal from './DeletePrivateTagModal';

type Props = {
  transactionTags: TransactionTags;
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

  return (
    <>
      <Text marginBottom={ 12 }>
        Use private transaction tags to label any transactions of interest.
        Private tags are saved in your account and are only visible when you are logged in.
      </Text>
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
