import { Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { WatchlistAddress } from 'types/api/account';

import useApiFetch from 'lib/api/useApiFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  data: Pick<WatchlistAddress, 'address_hash' | 'id'>;
}

const DeleteAddressModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, data }) => {
  const isMobile = useIsMobile();
  const apiFetch = useApiFetch();

  const mutationFn = useCallback(() => {
    return apiFetch('watchlist', {
      pathParams: { id: String(data.id) },
      fetchParams: { method: 'DELETE' },
    });
  }, [ data?.id, apiFetch ]);

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
