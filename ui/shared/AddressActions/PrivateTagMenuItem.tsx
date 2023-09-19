import { MenuItem, Icon, chakra, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { Address } from 'types/api/address';

import iconPrivateTags from 'icons/privattags.svg';
import { getResourceKey } from 'lib/api/useApiQuery';
import getPageType from 'lib/mixpanel/getPageType';
import PrivateTagModal from 'ui/privateTags/AddressModal/AddressModal';

interface Props {
  className?: string;
  hash: string;
  onBeforeClick: () => boolean;
}

const PrivateTagMenuItem = ({ className, hash, onBeforeClick }: Props) => {
  const modal = useDisclosure();
  const queryClient = useQueryClient();
  const router = useRouter();

  const queryKey = getResourceKey('address', { pathParams: { hash } });
  const addressData = queryClient.getQueryData<Address>(queryKey);

  const handleClick = React.useCallback(() => {
    if (!onBeforeClick()) {
      return;
    }

    modal.onOpen();
  }, [ modal, onBeforeClick ]);

  const handleAddPrivateTag = React.useCallback(async() => {
    await queryClient.refetchQueries({ queryKey });
    modal.onClose();
  }, [ queryClient, queryKey, modal ]);

  const formData = React.useMemo(() => {
    return {
      address_hash: hash,
    };
  }, [ hash ]);

  if (addressData?.private_tags?.length) {
    return null;
  }

  const pageType = getPageType(router.pathname);

  return (
    <>
      <MenuItem className={ className } onClick={ handleClick }>
        <Icon as={ iconPrivateTags } boxSize={ 6 } mr={ 2 }/>
        <span>Add private tag</span>
      </MenuItem>
      <PrivateTagModal
        data={ formData }
        pageType={ pageType }
        isOpen={ modal.isOpen }
        onClose={ modal.onClose }
        onSuccess={ handleAddPrivateTag }
      />
    </>
  );
};

export default React.memo(chakra(PrivateTagMenuItem));
