import React, { useCallback, useState } from 'react';

import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';

import AddressTagTable from './AddressTagTable/AddressTagTable';
import AddressModal from './AddressModal/AddressModal';

import type { TPrivateTagsAddressItem } from 'data/privateTagsAddress';
import { privateTagsAddress } from 'data/privateTagsAddress';
import DeletePrivateTagModal from './DeletePrivateTagModal';

const PrivateAddressTags: React.FC = () => {
  const addressModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();

  const [ addressModalData, setAddressModalData ] = useState<TPrivateTagsAddressItem>();
  const [ deleteModalData, setDeleteModalData ] = useState<string>();

  const onEditClick = useCallback((data: TPrivateTagsAddressItem) => {
    setAddressModalData(data);
    addressModalProps.onOpen();
  }, [ addressModalProps ])

  const onAddressModalClose = useCallback(() => {
    setAddressModalData(undefined);
    addressModalProps.onClose();
  }, [ addressModalProps ]);

  const onDeleteClick = useCallback((data: TPrivateTagsAddressItem) => {
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
      { Boolean(privateTagsAddress.length) && (
        <AddressTagTable
          data={ privateTagsAddress }
          onDeleteClick={ onDeleteClick }
          onEditClick={ onEditClick }
        />
      ) }
      <Box marginTop={ 8 }>
        <Button
          variant="primary"
          size="lg"
          onClick={ addressModalProps.onOpen }
        >
          Add address tag
        </Button>
      </Box>
      <AddressModal { ...addressModalProps } onClose={ onAddressModalClose } data={ addressModalData }/>
      <DeletePrivateTagModal { ...deleteModalProps } onClose={ onDeleteModalClose } tag={ deleteModalData }/>
    </>
  );
};

export default PrivateAddressTags
