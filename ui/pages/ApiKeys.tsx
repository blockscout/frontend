import { Box, Button, HStack, Link, Text, Skeleton, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { ApiKey, ApiKeys } from 'types/api/account';

import delay from 'lib/delay';
import { space } from 'lib/html-entities';
import ApiKeyModal from 'ui/apiKey/ApiKeyModal/ApiKeyModal';
import ApiKeyTable from 'ui/apiKey/ApiKeyTable/ApiKeyTable';
import DeleteApiKeyModal from 'ui/apiKey/DeleteApiKeyModal';
import AccountPageHeader from 'ui/shared/AccountPageHeader';
import Page from 'ui/shared/Page/Page';
import SkeletonTable from 'ui/shared/SkeletonTable';

const DATA_LIMIT = 3;

const ApiKeysPage: React.FC = () => {
  const apiKeyModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();

  const [ apiKeyModalData, setApiKeyModalData ] = useState<ApiKey>();
  const [ deleteModalData, setDeleteModalData ] = useState<ApiKey>();

  const { data, isLoading, isError } = useQuery<unknown, unknown, ApiKeys>([ 'api-keys' ], async() => {
    const [ response ] = await Promise.all([
      fetch('/api/account/api-keys'),
      delay(5000),
    ]);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  const onEditClick = useCallback((data: ApiKey) => {
    setApiKeyModalData(data);
    apiKeyModalProps.onOpen();
  }, [ apiKeyModalProps ]);

  const onApiKeyModalClose = useCallback(() => {
    setApiKeyModalData(undefined);
    apiKeyModalProps.onClose();
  }, [ apiKeyModalProps ]);

  const onDeleteClick = useCallback((data: ApiKey) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const content = (() => {
    if (isLoading || isError) {
      return (
        <>
          <SkeletonTable columns={ [ '100%', '108px' ] }/>
          <Skeleton height="44px" width="156px" marginTop={ 8 }/>
        </>
      );
    }

    const canAdd = data.length < DATA_LIMIT;
    return (
      <>
        <ApiKeyTable
          data={ data }
          onDeleteClick={ onDeleteClick }
          onEditClick={ onEditClick }
          limit={ DATA_LIMIT }
        />
        <HStack marginTop={ 8 } spacing={ 5 }>
          <Button
            variant="primary"
            size="lg"
            onClick={ apiKeyModalProps.onOpen }
            disabled={ !canAdd }
          >
            Add API key
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
        <AccountPageHeader text="API keys"/>
        <Text marginBottom={ 12 }>
          Create API keys to use for your RPC and EthRPC API requests. For more information, see { space }
          <Link href="#">“How to use a Blockscout API key”</Link>.
        </Text>
        { content }
      </Box>
      <ApiKeyModal { ...apiKeyModalProps } onClose={ onApiKeyModalClose } data={ apiKeyModalData }/>
      { deleteModalData && <DeleteApiKeyModal { ...deleteModalProps } onClose={ onDeleteModalClose } data={ deleteModalData }/> }
    </Page>
  );
};

export default ApiKeysPage;
