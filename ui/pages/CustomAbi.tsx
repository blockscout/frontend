import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { CustomAbi } from 'types/api/account';

import useApiQuery from 'lib/api/useApiQuery';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import { CUSTOM_ABI } from 'stubs/account';
import CustomAbiModal from 'ui/customAbi/CustomAbiModal/CustomAbiModal';
import CustomAbiListItem from 'ui/customAbi/CustomAbiTable/CustomAbiListItem';
import CustomAbiTable from 'ui/customAbi/CustomAbiTable/CustomAbiTable';
import DeleteCustomAbiModal from 'ui/customAbi/DeleteCustomAbiModal';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

const CustomAbiPage: React.FC = () => {
  const customAbiModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  useRedirectForInvalidAuthToken();

  const [ customAbiModalData, setCustomAbiModalData ] = useState<CustomAbi>();
  const [ deleteModalData, setDeleteModalData ] = useState<CustomAbi>();

  const { data, isPlaceholderData, isError } = useApiQuery('custom_abi', {
    queryOptions: {
      placeholderData: Array(3).fill(CUSTOM_ABI),
    },
  });

  const onEditClick = useCallback((data: CustomAbi) => {
    setCustomAbiModalData(data);
    customAbiModalProps.onOpen();
  }, [ customAbiModalProps ]);

  const onCustomAbiModalClose = useCallback(() => {
    setCustomAbiModalData(undefined);
    customAbiModalProps.onClose();
  }, [ customAbiModalProps ]);

  const onDeleteClick = useCallback((data: CustomAbi) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const description = (
    <AccountPageDescription>
      Add custom ABIs for any contract and access when logged into your account. Helpful for debugging, functional testing and contract interaction.
    </AccountPageDescription>
  );

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    const list = (
      <>
        <Box display={{ base: 'block', lg: 'none' }}>
          { data?.map((item, index) => (
            <CustomAbiListItem
              key={ item.id + (isPlaceholderData ? index : '') }
              item={ item }
              isLoading={ isPlaceholderData }
              onDeleteClick={ onDeleteClick }
              onEditClick={ onEditClick }
            />
          )) }
        </Box>
        <Box display={{ base: 'none', lg: 'block' }}>
          <CustomAbiTable
            data={ data }
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
        { Boolean(data?.length) && list }
        <Skeleton mt={ 8 } isLoaded={ !isPlaceholderData } display="inline-block">
          <Button
            size="lg"
            onClick={ customAbiModalProps.onOpen }
          >
            Add custom ABI
          </Button>
        </Skeleton>
        <CustomAbiModal { ...customAbiModalProps } onClose={ onCustomAbiModalClose } data={ customAbiModalData }/>
        { deleteModalData && <DeleteCustomAbiModal { ...deleteModalProps } onClose={ onDeleteModalClose } data={ deleteModalData }/> }
      </>
    );
  })();

  return (
    <>
      <PageTitle title="Custom ABI"/>
      { content }
    </>
  );
};

export default CustomAbiPage;
