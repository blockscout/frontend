import { Box, Button, HStack, Text, Spinner, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { CustomAbi, CustomAbis } from 'types/api/account';

import CustomAbiModal from 'ui/customAbi/CustomAbiModal/CustomAbiModal';
import CustomAbiTable from 'ui/customAbi/CustomAbiTable/CustomAbiTable';
import DeleteCustomAbiModal from 'ui/customAbi/DeleteCustomAbiModal';
import AccountPageHeader from 'ui/shared/AccountPageHeader';
import Page from 'ui/shared/Page/Page';

const CustomAbiPage: React.FC = () => {
  const customAbiModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();

  const [ customAbiModalData, setCustomAbiModalData ] = useState<CustomAbi>();
  const [ deleteModalData, setDeleteModalData ] = useState<CustomAbi>();

  const { data, isLoading, isError } = useQuery<unknown, unknown, CustomAbis>([ 'custom-abis' ], async() => {
    const response = await fetch('/api/account/custom-abis');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
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

  const content = (() => {
    if (isLoading || isError) {
      return <Spinner/>;
    }

    return (
      <>
        { data.length > 0 && (
          <CustomAbiTable
            data={ data }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        ) }
        <HStack marginTop={ 8 } spacing={ 5 }>
          <Button
            variant="primary"
            size="lg"
            onClick={ customAbiModalProps.onOpen }
          >
            Add custom ABI
          </Button>
        </HStack>
      </>
    );
  })();

  return (
    <Page>
      <Box h="100%">
        <AccountPageHeader text="Custom ABI"/>
        <Text marginBottom={ 12 }>
            Add custom ABIs for any contract and access when logged into your account. Helpful for debugging, functional testing and contract interaction.
        </Text>
        { content }
      </Box>
      <CustomAbiModal { ...customAbiModalProps } onClose={ onCustomAbiModalClose } data={ customAbiModalData }/>
      { deleteModalData && <DeleteCustomAbiModal { ...deleteModalProps } onClose={ onDeleteModalClose } data={ deleteModalData }/> }
    </Page>
  );
};

export default CustomAbiPage;
