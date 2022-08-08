import React, { useCallback, useState } from 'react';

import { Box, Button, Spinner, Text, useDisclosure } from '@chakra-ui/react';

import AddressTagTable from './AddressTagTable/AddressTagTable';
import AddressModal from './AddressModal/AddressModal';
import DeletePrivateTagModal from './DeletePrivateTagModal';
import type { AddressTags, AddressTag } from 'types/api/account';

type Props = {
  addressTags: AddressTags;
}

const PrivateAddressTags = ({ addressTags }: Props) => {
  const addressModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();

  const [ addressModalData, setAddressModalData ] = useState<AddressTag>();
  const [ deleteModalData, setDeleteModalData ] = useState<AddressTag>();

  const onEditClick = useCallback((data: AddressTag) => {
    setAddressModalData(data);
    addressModalProps.onOpen();
  }, [ addressModalProps ]);

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

  return (
    <>
      <Text marginBottom={ 12 }>
        Use private transaction tags to label any transactions of interest.
        Private tags are saved in your account and are only visible when you are logged in.
      </Text>
      { !addressTags && <Spinner/> }
      { Boolean(addressTags?.length) && (
        <AddressTagTable
          data={ addressTags }
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
      <DeletePrivateTagModal
        { ...deleteModalProps }
        onClose={ onDeleteModalClose }
        data={ deleteModalData }
        type="address"
      />
    </>
  );
};

export default PrivateAddressTags;
