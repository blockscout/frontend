import { Text } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { TWatchlistItem } from 'types/client/account';

import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: TWatchlistItem;
}

const DeleteAddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const [ pending, setPending ] = useState(false);

  const queryClient = useQueryClient();

  const { mutate } = useMutation(() => {
    return fetch(`/api/account/watchlist/${ data?.id }`, { method: 'DELETE' });
  }, {
    onError: () => {
      // eslint-disable-next-line no-console
      console.log('error');
    },
    onSuccess: () => {
      queryClient.refetchQueries([ 'watchlist' ]).then(() => {
        onClose();
        setPending(false);
      });
    },
  });

  const onDelete = useCallback(() => {
    setPending(true);
    mutate();
  }, [ mutate ]);

  const address = data?.address_hash;

  const renderText = useCallback(() => {
    return (
      <Text display="flex">Address <Text fontWeight="600" whiteSpace="pre"> { address || 'address' } </Text>   will be deleted</Text>
    );
  }, [ address ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Remove address from watch list"
      renderContent={ renderText }
      pending={ pending }
    />
  );
};

export default DeleteAddressModal;
