import { Box, Button, Text, Skeleton, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { AddressTags, AddressTag } from 'types/api/account';

import fetch from 'lib/client/fetch';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import SkeletonTable from 'ui/shared/SkeletonTable';

import AddressModal from './AddressModal/AddressModal';
import AddressTagTable from './AddressTagTable/AddressTagTable';
import DeletePrivateTagModal from './DeletePrivateTagModal';

const PrivateAddressTags = () => {
  const { data: addressTagsData, isLoading, isError } =
    useQuery<unknown, unknown, AddressTags>([ 'address-tags' ], async() => fetch('/api/account/private-tags/address'), { refetchOnMount: false });

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

  const description = (
    <Text marginBottom={ 12 }>
        Use private transaction tags to label any transactions of interest.
        Private tags are saved in your account and are only visible when you are logged in.
    </Text>
  );

  if (isLoading && !addressTagsData) {
    return (
      <>
        { description }
        <SkeletonTable columns={ [ '60%', '40%', '108px' ] }/>
        <Skeleton height="44px" width="156px" marginTop={ 8 }/>
      </>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  return (
    <>
      { description }
      { Boolean(addressTagsData?.length) && (
        <AddressTagTable
          data={ addressTagsData }
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
