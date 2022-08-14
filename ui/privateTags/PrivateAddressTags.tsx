import { Box, Button, Text, Skeleton, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { AddressTags, AddressTag } from 'types/api/account';

import SkeletonTable from 'ui/shared/SkeletonTable';

import AddressModal from './AddressModal/AddressModal';
import AddressTagTable from './AddressTagTable/AddressTagTable';
import DeletePrivateTagModal from './DeletePrivateTagModal';

type Props = {
  addressTags?: AddressTags;
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

  if (!addressTags) {
    return (
      <>
        <Skeleton height={ 6 } width="250px" borderRadius="full" marginBottom={ 12 }/>
        <SkeletonTable columns={ [ 'auto', '40%', '108px' ] }/>
        <Skeleton height="44px" width="156px" borderRadius="base" marginTop={ 8 }/>
      </>
    );
  }

  return (
    <>
      <Text marginBottom={ 12 }>
        Use private transaction tags to label any transactions of interest.
        Private tags are saved in your account and are only visible when you are logged in.
      </Text>
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
