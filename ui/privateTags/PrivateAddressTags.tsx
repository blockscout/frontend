import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { AddressTags, AddressTag } from 'types/api/account';

import fetch from 'lib/client/fetch';
import delay from 'lib/delay';
import useIsMobile from 'lib/hooks/useIsMobile';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import SkeletonAccountMobile from 'ui/shared/SkeletonAccountMobile';
import SkeletonTable from 'ui/shared/SkeletonTable';

import AddressModal from './AddressModal/AddressModal';
import AddressTagListItem from './AddressTagTable/AddressTagListItem';
import AddressTagTable from './AddressTagTable/AddressTagTable';
import DeletePrivateTagModal from './DeletePrivateTagModal';

const PrivateAddressTags = () => {
  const { data: addressTagsData, isLoading, isError } =
    useQuery<unknown, unknown, AddressTags>([ 'address-tags' ], async() => {
      const [ result ] = await Promise.all([
        fetch('/api/account/private-tags/address'),
        delay(5_000_000),
      ]);
      return result;
    }, { refetchOnMount: false });

  const addressModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  const isMobile = useIsMobile();

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
    <AccountPageDescription>
        Use private address tags to track any addresses of interest.
        Private tags are saved in your account and are only visible when you are logged in.
    </AccountPageDescription>
  );

  if (isLoading && !addressTagsData) {
    const loader = isMobile ? (
      <Box>
        <SkeletonAccountMobile/>
        <SkeletonAccountMobile/>
      </Box>
    ) : (
      <>
        <SkeletonTable columns={ [ '60%', '40%', '108px' ] }/>
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
    return <DataFetchAlert/>;
  }

  const list = isMobile ? (
    <Box>
      { addressTagsData.map((item: AddressTag) => (
        <AddressTagListItem
          item={ item }
          key={ item.id }
          onDeleteClick={ onDeleteClick }
          onEditClick={ onEditClick }
        />
      )) }
    </Box>
  ) : (
    <AddressTagTable
      data={ addressTagsData }
      onDeleteClick={ onDeleteClick }
      onEditClick={ onEditClick }
    />
  );

  return (
    <>
      { description }
      { Boolean(addressTagsData?.length) && list }
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
