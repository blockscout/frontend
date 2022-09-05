import { Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import type { ApiKey, ApiKeys } from 'types/api/account';

import fetch from 'lib/client/fetch';
import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: ApiKey;
}

const DeleteAddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const queryClient = useQueryClient();

  const mutationFn = useCallback(() => {
    return fetch(`/api/account/api-keys/${ data.api_key }`, { method: 'DELETE' });
  }, [ data ]);

  const onSuccess = useCallback(async() => {
    queryClient.setQueryData([ 'api-keys' ], (prevData: ApiKeys | undefined) => {
      return prevData?.filter((item) => item.api_key !== data.api_key);
    });
  }, [ data, queryClient ]);

  const renderText = useCallback(() => {
    return (
      <Text> API key for <Text fontWeight="600" as="span">{ ` "${ data.name || 'name' }" ` }</Text> will be deleted </Text>
    );
  }, [ data.name ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      title="Remove API key"
      renderContent={ renderText }
      mutationFn={ mutationFn }
      onSuccess={ onSuccess }
    />
  );
};

export default DeleteAddressModal;
