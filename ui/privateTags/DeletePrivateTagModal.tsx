import { Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import type { AddressTag, TransactionTag, AddressTags, TransactionTags } from 'types/api/account';
import { QueryKeys } from 'types/client/accountQueries';

import useFetch from 'lib/hooks/useFetch';
import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: AddressTag | TransactionTag;
  type: 'address' | 'transaction';
}

const DeletePrivateTagModal: React.FC<Props> = ({ isOpen, onClose, data, type }) => {
  const tag = data.name;
  const id = data.id;

  const queryClient = useQueryClient();
  const fetch = useFetch();

  const mutationFn = useCallback(() => {
    return fetch(`/node-api/account/private-tags/${ type }/${ id }`, { method: 'DELETE' });
  }, [ fetch, type, id ]);

  const onSuccess = useCallback(async() => {
    if (type === 'address') {
      queryClient.setQueryData([ QueryKeys.addressTags ], (prevData: AddressTags | undefined) => {
        return prevData?.filter((item: AddressTag) => item.id !== id);
      });
    } else {
      queryClient.setQueryData([ QueryKeys.transactionTags ], (prevData: TransactionTags | undefined) => {
        return prevData?.filter((item: TransactionTag) => item.id !== id);
      });
    }
  }, [ type, id, queryClient ]);

  const renderText = useCallback(() => {
    return (
      <Text>Tag<Text fontWeight="600" as="span">{ ` "${ tag || 'tag' }" ` }</Text>will be deleted</Text>
    );
  }, [ tag ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      title="Removal of private tag"
      renderContent={ renderText }
      mutationFn={ mutationFn }
      onSuccess={ onSuccess }
    />
  );
};

export default DeletePrivateTagModal;
