// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { WatchlistAddress } from 'client/features/account/types/api';

import useApiFetch from 'client/api/hooks/useApiFetch';

import DeleteModal from 'client/features/account/components/DeleteModal';

import useIsMobile from 'client/shared/hooks/useIsMobile';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  onSuccess: () => Promise<void>;
  data: Pick<WatchlistAddress, 'address_hash' | 'id'>;
};

const DeleteAddressModal: React.FC<Props> = ({ open, onOpenChange, onSuccess, data }) => {
  const isMobile = useIsMobile();
  const apiFetch = useApiFetch();

  const mutationFn = useCallback(() => {
    return apiFetch('general:watchlist', {
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
      open={ open }
      onOpenChange={ onOpenChange }
      title="Remove address from watch list"
      renderContent={ renderModalContent }
      mutationFn={ mutationFn }
      onSuccess={ onSuccess }
    />
  );
};

export default DeleteAddressModal;
