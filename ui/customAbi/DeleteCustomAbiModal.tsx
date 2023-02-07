import { Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import type { CustomAbi, CustomAbis } from 'types/api/account';

import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: CustomAbi;
}

const DeleteCustomAbiModal: React.FC<Props> = ({ isOpen, onClose, data }) => {

  const queryClient = useQueryClient();
  const apiFetch = useApiFetch();

  const mutationFn = useCallback(() => {
    return apiFetch('custom_abi', {
      pathParams: { id: String(data.id) },
      fetchParams: { method: 'DELETE' },
    });
  }, [ apiFetch, data.id ]);

  const onSuccess = useCallback(async() => {
    queryClient.setQueryData([ resourceKey('custom_abi') ], (prevData: CustomAbis | undefined) => {
      return prevData?.filter((item) => item.id !== data.id);
    });
  }, [ data, queryClient ]);

  const renderText = useCallback(() => {
    return (
      <Text>Custom ABI for<Text fontWeight="700" as="span">{ ` "${ data.name || 'name' }" ` }</Text>will be deleted</Text>
    );
  }, [ data.name ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      title="Remove custom ABI"
      renderContent={ renderText }
      mutationFn={ mutationFn }
      onSuccess={ onSuccess }
    />
  );
};

export default React.memo(DeleteCustomAbiModal);
