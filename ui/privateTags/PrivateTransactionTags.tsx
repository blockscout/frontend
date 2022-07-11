import React, { useCallback, useState } from 'react';

import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';

import TransactionTagTable from './TransactionTagTable/TransactionTagTable';
import TransactionModal from './TransactionModal/TransactionModal';

import type { TPrivateTagsTransactionItem } from './../../data/privateTagsTransaction';
import { privateTagsTransaction } from './../../data/privateTagsTransaction';
import DeletePrivateTagModal from './DeletePrivateTagModal';

const PrivateTransactionTags: React.FC = () => {
  const transactionModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();

  const [ transactionModalData, setTransactionModalData ] = useState<TPrivateTagsTransactionItem>();
  const [ deleteModalData, setDeleteModalData ] = useState<string>();

  const onEditClick = useCallback((data: TPrivateTagsTransactionItem) => {
    setTransactionModalData(data);
    transactionModalProps.onOpen();
  }, [ transactionModalProps ])

  const onAddressModalClose = useCallback(() => {
    setTransactionModalData(undefined);
    transactionModalProps.onClose();
  }, [ transactionModalProps ]);

  const onDeleteClick = useCallback((data: TPrivateTagsTransactionItem) => {
    setDeleteModalData(data.tag);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ])

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
      { Boolean(privateTagsTransaction.length) && (
        <TransactionTagTable
          data={ privateTagsTransaction }
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
      <DeletePrivateTagModal { ...deleteModalProps } onClose={ onDeleteModalClose } tag={ deleteModalData }/>
    </>
  );
};

export default PrivateTransactionTags
