import { Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { TWatchlistItem } from 'types/client/account';

import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  data: Pick<TWatchlistItem, 'address_hash' | 'id'>;
}

const DeleteAddressModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, data }) => {
  const isMobile = useIsMobile();
  const fetch = useFetch();

  const mutationFn = useCallback(() => {
    return fetch(`/node-api/account/watchlist/${ data?.id }`, { method: 'DELETE' });
  }, [ data?.id, fetch ]);

  const address = data?.address_hash;

  const renderModalContent = useCallback(() => {
    const addressString = isMobile ? [ address.slice(0, 4), address.slice(-4) ].join('...') : address;
    return (
      <Text>Address <Text fontWeight="700" as="span"> { addressString || 'address' }</Text> will be deleted</Text>
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
