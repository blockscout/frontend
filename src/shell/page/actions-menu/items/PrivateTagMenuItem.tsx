// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { ItemProps } from '../types';
import type { Address } from 'src/slices/address/types/api';
import type { Transaction } from 'src/slices/tx/types/api';

import { getResourceKey } from 'src/api/hooks/useApiQuery';

import AuthGuard from 'src/features/account/components/auth-modal/guard/AuthGuard';
import AddressModal from 'src/features/account/pages/private-tags/AddressModal/AddressModal';
import TransactionModal from 'src/features/account/pages/private-tags/TransactionModal/TransactionModal';

import * as mixpanel from 'src/services/mixpanel';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { MenuItem } from 'src/toolkit/chakra/menu';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

import ButtonItem from '../parts/ButtonItem';

interface Props extends ItemProps {
  entityType?: 'address' | 'tx';
}

const PrivateTagMenuItem = ({ hash, entityType = 'address', type }: Props) => {
  const modal = useDisclosure();
  const queryClient = useQueryClient();
  const router = useRouter();

  const queryKey = getResourceKey(entityType === 'tx' ? 'core:tx' : 'core:address', { pathParams: { hash } });
  const queryData = queryClient.getQueryData<Address | Transaction>(queryKey);

  const handleAddPrivateTag = React.useCallback(async() => {
    await queryClient.refetchQueries({ queryKey });
    modal.onClose();
  }, [ queryClient, queryKey, modal ]);

  if (
    queryData &&
    (
      ('private_tags' in queryData && queryData.private_tags?.length) ||
      ('transaction_tag' in queryData && queryData.transaction_tag)
    )
  ) {
    return null;
  }

  const pageType = mixpanel.getPageType(router.pathname);
  const modalProps = {
    open: modal.open,
    onOpenChange: modal.onOpenChange,
    onSuccess: handleAddPrivateTag,
    pageType,
  };

  const element = (() => {
    switch (type) {
      case 'button': {
        return (
          <AuthGuard onAuthSuccess={ modal.onOpen }>
            { ({ onClick }) => (
              // FIXME use non-navigation icon
              <ButtonItem label="Add private tag" icon="navigation/private_tags" onClick={ onClick }/>
            ) }
          </AuthGuard>
        );
      }
      case 'menu_item': {
        return (
          <AuthGuard onAuthSuccess={ modal.onOpen }>
            { ({ onClick }) => (
              <MenuItem onClick={ onClick } value="add-private-tag">
                { /* FIXME use non-navigation icon */ }
                <SpriteIcon name="navigation/private_tags" boxSize={ 6 }/>
                <span>Add private tag</span>
              </MenuItem>
            ) }
          </AuthGuard>
        );
      }
    }
  })();

  return (
    <>
      { element }
      { entityType === 'tx' ?
        <TransactionModal { ...modalProps } data={{ transaction_hash: hash }}/> :
        <AddressModal { ...modalProps } data={{ address_hash: hash }}/>
      }
    </>
  );
};

export default React.memo(PrivateTagMenuItem);
