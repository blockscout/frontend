import { MenuItem, Icon, chakra, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { Address } from 'types/api/address';
import type { Transaction } from 'types/api/transaction';

import iconPrivateTags from 'icons/privattags.svg';
import { getResourceKey } from 'lib/api/useApiQuery';
import getPageType from 'lib/mixpanel/getPageType';
import AddressModal from 'ui/privateTags/AddressModal/AddressModal';
import TransactionModal from 'ui/privateTags/TransactionModal/TransactionModal';

interface Props {
  className?: string;
  hash: string;
  onBeforeClick: () => boolean;
  type?: 'address' | 'tx';
}

const PrivateTagMenuItem = ({ className, hash, onBeforeClick, type = 'address' }: Props) => {
  const modal = useDisclosure();
  const queryClient = useQueryClient();
  const router = useRouter();

  const queryKey = getResourceKey(type === 'tx' ? 'tx' : 'address', { pathParams: { hash } });
  const queryData = queryClient.getQueryData<Address | Transaction>(queryKey);

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

  if (
    queryData &&
    (
      ('private_tags' in queryData && queryData.private_tags?.length) ||
      ('tx_tag' in queryData && queryData.tx_tag)
    )
  ) {
    return null;
  }

  const pageType = getPageType(router.pathname);
  const modalProps = {
    isOpen: modal.isOpen,
    onClose: modal.onClose,
    onSuccess: handleAddPrivateTag,
    pageType,
  };

  return (
    <>
      <MenuItem className={ className } onClick={ handleClick }>
        <Icon as={ iconPrivateTags } boxSize={ 6 } mr={ 2 }/>
        <span>Add private tag</span>
      </MenuItem>
      { type === 'tx' ?
        <TransactionModal { ...modalProps } data={{ transaction_hash: hash }}/> :
        <AddressModal { ...modalProps } data={{ address_hash: hash }}/>
      }
    </>
  );
};

export default React.memo(chakra(PrivateTagMenuItem));
