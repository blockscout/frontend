import { Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import type { CustomAbi, CustomAbis } from 'types/api/account';
import { QueryKeys } from 'types/client/accountQueries';

import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: CustomAbi;
}

const DeleteCustomAbiModal: React.FC<Props> = ({ isOpen, onClose, data }) => {

  const queryClient = useQueryClient();

  const mutationFn = useCallback(() => {
    return fetch(`/api/account/custom-abis/${ data.id }`, { method: 'DELETE' });
  }, [ data ]);

  const onSuccess = useCallback(async() => {
    queryClient.setQueryData([ QueryKeys.customAbis ], (prevData: CustomAbis | undefined) => {
      return prevData?.filter((item) => item.id !== data.id);
    });
  }, [ data, queryClient ]);

  const renderText = useCallback(() => {
    return (
      <Text>Custom ABI for<Text fontWeight="600" as="span">{ ` "${ data.name || 'name' }" ` }</Text>will be deleted</Text>
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
