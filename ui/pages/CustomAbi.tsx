import { Box, Button, HStack, Text, Spinner, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { CustomAbi, CustomAbis } from 'types/api/account';

// import ApiKeyTable from 'ui/apiKey/ApiKeyTable/ApiKeyTable';
// import DeleteApiKeyModal from 'ui/apiKey/DeleteApiKeyModal';
import CustomAbiModal from 'ui/customAbi/CustomAbiModal/CustomAbiModal';
import AccountPageHeader from 'ui/shared/AccountPageHeader';
import Page from 'ui/shared/Page/Page';

const DATA_LIMIT = 3;

const CustomAbiPage: React.FC = () => {
  const customAbiModalProps = useDisclosure();
  //   const deleteModalProps = useDisclosure();

  const [ customAbiModalData, setCustomAbiModalData ] = useState<CustomAbi>();
  //   const [ deleteModalData, setDeleteModalData ] = useState<CustomAbi>();

  const { data, isLoading, isError } = useQuery<unknown, unknown, CustomAbis>([ 'custom-abis' ], async() => {
    const response = await fetch('/api/account/custom-abis');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  //   const onEditClick = useCallback((data: CustomAbi) => {
  //     setCustomAbiModalData(data);
  //     customAbiModalProps.onOpen();
  //   }, [ customAbiModalProps ]);

  const onCustomAbiModalClose = useCallback(() => {
    setCustomAbiModalData(undefined);
    customAbiModalProps.onClose();
  }, [ customAbiModalProps ]);

  //   const onDeleteClick = useCallback((data: CustomAbi) => {
  //     setDeleteModalData(data);
  //     deleteModalProps.onOpen();
  //   }, [ deleteModalProps ]);

  //   const onDeleteModalClose = useCallback(() => {
  //     setDeleteModalData(undefined);
  //     deleteModalProps.onClose();
  //   }, [ deleteModalProps ]);

  const content = (() => {
    if (isLoading || isError) {
      return <Spinner/>;
    }

    const canAdd = data.length < DATA_LIMIT;
    return (
      <>
        { /* { data.length > 0 && (
          <ApiKeyTable
            data={ data }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
            limit={ DATA_LIMIT }
          />
        ) } */ }
        <HStack marginTop={ 8 } spacing={ 5 }>
          <Button
            variant="primary"
            size="lg"
            onClick={ customAbiModalProps.onOpen }
            disabled={ !canAdd }
          >
            Add custom ABI
          </Button>
          { !canAdd && (
            <Text fontSize="sm" variant="secondary">
              { `You have added the maximum number of API keys (${ DATA_LIMIT }). Contact us to request additional keys.` }
            </Text>
          ) }
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
      { /* { deleteModalData && <DeleteApiKeyModal { ...deleteModalProps } onClose={ onDeleteModalClose } data={ deleteModalData }/> } */ }
    </Page>
  );
};

export default CustomAbiPage;
