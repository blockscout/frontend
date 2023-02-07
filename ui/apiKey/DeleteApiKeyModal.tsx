import { Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import type { ApiKey, ApiKeys } from 'types/api/account';

import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: ApiKey;
}

const DeleteApiKeyModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const queryClient = useQueryClient();
  const apiFetch = useApiFetch();

  const mutationFn = useCallback(() => {
    return apiFetch('api_keys', {
      pathParams: { id: data.api_key },
      fetchParams: { method: 'DELETE' },
    });
  }, [ data.api_key, apiFetch ]);

  const onSuccess = useCallback(async() => {
    queryClient.setQueryData([ resourceKey('api_keys') ], (prevData: ApiKeys | undefined) => {
      return prevData?.filter((item) => item.api_key !== data.api_key);
    });
  }, [ data, queryClient ]);

  const renderText = useCallback(() => {
    return (
      <Text> API key for <Text fontWeight="700" as="span">{ ` "${ data.name || 'name' }" ` }</Text> will be deleted </Text>
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

export default DeleteApiKeyModal;
