import { Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import type { TWatchlistItem, TWatchlist } from 'types/client/account';

import fetch from 'lib/client/fetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: TWatchlistItem;
}

const DeleteAddressModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const mutationFn = useCallback(() => {
    return fetch(`/api/account1/watchlist/${ data?.id }`, { method: 'DELETE' });
  }, [ data ]);

  const onSuccess = useCallback(async() => {
    queryClient.setQueryData([ 'watchlist' ], (prevData: TWatchlist | undefined) => {
      return prevData?.filter((item) => item.id !== data.id);
    });
  }, [ data, queryClient ]);

  const address = data?.address_hash;

  const renderModalContent = useCallback(() => {
    const addressString = isMobile ? [ address.slice(0, 4), address.slice(-4) ].join('...') : address;
    return (
      <Text display="flex">Address <Text fontWeight="600" whiteSpace="pre"> { addressString || 'address' } </Text>   will be deleted</Text>
    );
  }, [ address, isMobile ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      title="Remove address from watch list"
      renderContent={ renderModalContent }
      mutationFn={ mutationFn }
      onSuccess={ onSuccess }
    />
  );
};

export default DeleteAddressModal;
