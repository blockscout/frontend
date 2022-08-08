import { Text } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { AddressTag, TransactionTag } from 'types/api/account';

import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: AddressTag | TransactionTag;
  type: 'address' | 'transaction';
}

const DeletePrivateTagModal: React.FC<Props> = ({ isOpen, onClose, data, type }) => {
  const [ pending, setPending ] = useState(false);

  const tag = data?.name;
  const id = data?.id;

  const queryClient = useQueryClient();

  const { mutate } = useMutation(() => {
    return fetch(`/api/account/private-tags/${ type }/${ id }`, { method: 'DELETE' });
  }, {
    onError: () => {
      // eslint-disable-next-line no-console
      console.log('error');
    },
    onSuccess: () => {
      queryClient.refetchQueries([ type ]).then(() => {
        onClose();
        setPending(false);
      });
    },
  });

  const onDelete = useCallback(() => {
    setPending(true);
    mutate();
  }, [ mutate ]);

  const renderText = useCallback(() => {
    return (
      <Text display="flex">Tag<Text fontWeight="600" whiteSpace="pre">{ ` "${ tag || 'tag' }" ` }</Text>will be deleted</Text>
    );
  }, [ tag ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Removal of private tag"
      renderContent={ renderText }
      pending={ pending }
    />
  );
};

export default DeletePrivateTagModal;
