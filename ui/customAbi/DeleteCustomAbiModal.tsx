import { Text } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import type { CustomAbi, CustomAbis } from 'types/api/account';

import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: CustomAbi;
}

const DeleteCustomAbiModal: React.FC<Props> = ({ isOpen, onClose, data }) => {

  const queryClient = useQueryClient();

  const deleteApiKey = () => {
    return fetch(`/api/account/custom-abis/${ data.id }`, { method: 'DELETE' });
  };

  const mutation = useMutation(deleteApiKey, {
    onSuccess: async() => {
      queryClient.setQueryData([ 'custom-abis' ], (prevData: CustomAbis | undefined) => {
        return prevData?.filter((item) => item.id !== data.id);
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
      <Text display="flex">Custom ABI for<Text fontWeight="600" whiteSpace="pre">{ ` "${ data.name || 'name' }" ` }</Text>will be deleted</Text>
    );
  }, [ data.name ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Remove custom ABI"
      renderContent={ renderText }
      pending={ mutation.isLoading }
    />
  );
};

export default React.memo(DeleteCustomAbiModal);
