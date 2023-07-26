import { Box, Button, Link, Text, Skeleton, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { ApiKey } from 'types/api/account';

import useApiQuery from 'lib/api/useApiQuery';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import { space } from 'lib/html-entities';
import { API_KEY } from 'stubs/account';
import ApiKeyModal from 'ui/apiKey/ApiKeyModal/ApiKeyModal';
import ApiKeyListItem from 'ui/apiKey/ApiKeyTable/ApiKeyListItem';
import ApiKeyTable from 'ui/apiKey/ApiKeyTable/ApiKeyTable';
import DeleteApiKeyModal from 'ui/apiKey/DeleteApiKeyModal';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

const DATA_LIMIT = 3;

const ApiKeysPage: React.FC = () => {
  const apiKeyModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  useRedirectForInvalidAuthToken();

  const [ apiKeyModalData, setApiKeyModalData ] = useState<ApiKey>();
  const [ deleteModalData, setDeleteModalData ] = useState<ApiKey>();

  const { data, isPlaceholderData, isError } = useApiQuery('api_keys', {
    queryOptions: {
      placeholderData: Array(3).fill(API_KEY),
    },
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

  const description = (
    <AccountPageDescription>
      Create API keys to use for your RPC and EthRPC API requests. For more information, see { space }
      <Link href="https://docs.blockscout.com/for-users/api#api-keys" target="_blank">“How to use a Blockscout API key”</Link>.
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
            <ApiKeyListItem
              key={ item.api_key + (isPlaceholderData ? index : '') }
              item={ item }
              isLoading={ isPlaceholderData }
              onDeleteClick={ onDeleteClick }
              onEditClick={ onEditClick }
            />
          )) }
        </Box>
        <Box display={{ base: 'none', lg: 'block' }}>
          <ApiKeyTable
            data={ data }
            isLoading={ isPlaceholderData }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
            limit={ DATA_LIMIT }
          />
        </Box>
      </>
    );

    const canAdd = !isPlaceholderData ? (data?.length || 0) < DATA_LIMIT : true;

    return (
      <>
        { description }
        { Boolean(data?.length) && list }
        <Skeleton
          marginTop={ 8 }
          flexDir={{ base: 'column', lg: 'row' }}
          alignItems={{ base: 'start', lg: 'center' }}
          isLoaded={ !isPlaceholderData }
          display="inline-flex"
          columnGap={ 5 }
          rowGap={ 5 }
        >
          <Button
            size="lg"
            onClick={ apiKeyModalProps.onOpen }
            isDisabled={ !canAdd }
          >
              Add API key
          </Button>
          { !canAdd && (
            <Text fontSize="sm" variant="secondary">
              { `You have added the maximum number of API keys (${ DATA_LIMIT }). Contact us to request additional keys.` }
            </Text>
          ) }
        </Skeleton>
        <ApiKeyModal { ...apiKeyModalProps } onClose={ onApiKeyModalClose } data={ apiKeyModalData }/>
        { deleteModalData && <DeleteApiKeyModal { ...deleteModalProps } onClose={ onDeleteModalClose } data={ deleteModalData }/> }
      </>
    );
  })();

  return (
    <>
      <PageTitle title="API keys"/>
      { content }
    </>
  );
};

export default ApiKeysPage;
