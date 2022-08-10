import { Text } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import type { ApiKey, ApiKeys } from 'types/api/account';

import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: ApiKey;
}

const DeleteAddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {

  const queryClient = useQueryClient();

  const deleteApiKey = () => {
    return fetch(`/api/account/api-keys/${ data.api_key }`, { method: 'DELETE' });
  };

  const mutation = useMutation(deleteApiKey, {
    onSuccess: async() => {
      queryClient.setQueryData([ 'api-keys' ], (prevData: ApiKeys | undefined) => {
        return prevData?.filter((item) => item.api_key !== data.api_key);
      });

      onClose();
    },
    // eslint-disable-next-line no-console
    onError: console.error,
  });

  const onDelete = useCallback(() => {
    mutation.mutate(data);
  }, [ data, mutation ]);

  const renderText = useCallback(() => {
    return (
      <Text display="flex">API key for<Text fontWeight="600" whiteSpace="pre">{ ` "${ data.name || 'name' }" ` }</Text>will be deleted</Text>
    );
  }, [ data.name ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Remove API key"
      renderContent={ renderText }
      pending={ mutation.isLoading }
    />
  );
};

export default DeleteAddressModal;
