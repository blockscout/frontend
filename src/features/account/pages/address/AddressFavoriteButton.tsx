// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import { getResourceKey } from 'src/api/hooks/useApiQuery';

import AuthGuard from 'src/features/account/components/auth-modal/guard/AuthGuard';
import useProfileQuery from 'src/features/account/hooks/useProfileQuery';
import WatchlistAddModal from 'src/features/account/pages/watchlist/AddressModal/AddressModal';
import DeleteAddressModal from 'src/features/account/pages/watchlist/DeleteAddressModal';

import config from 'src/config';
import * as mixpanel from 'src/services/mixpanel';
import usePreventFocusAfterModalClosing from 'src/shared/hooks/usePreventFocusAfterModalClosing';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

interface Props {
  className?: string;
  hash: string;
  watchListId: number | null | undefined;
}

const AddressFavoriteButton = ({ className, hash, watchListId }: Props) => {
  const addModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  const queryClient = useQueryClient();
  const router = useRouter();
  const onFocusCapture = usePreventFocusAfterModalClosing();
  const profileQuery = useProfileQuery();

  const handleAddToFavorite = React.useCallback(() => {
    watchListId ? deleteModalProps.onOpen() : addModalProps.onOpen();
    !watchListId && mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Add to watchlist' });
  }, [ watchListId, deleteModalProps, addModalProps ]);

  const handleAddOrDeleteSuccess = React.useCallback(async() => {
    const queryKey = getResourceKey('core:address', { pathParams: { hash: router.query.hash?.toString() } });
    await queryClient.refetchQueries({ queryKey });
    addModalProps.onClose();
  }, [ addModalProps, queryClient, router.query.hash ]);

  const formData = React.useMemo(() => {
    if (typeof watchListId !== 'number') {
      return { address_hash: hash };
    }

    return {
      address_hash: hash,
      id: watchListId,
    };
  }, [ hash, watchListId ]);

  if (!config.features.account.isEnabled) {
    return null;
  }

  return (
    <>
      <AuthGuard onAuthSuccess={ handleAddToFavorite }>
        { ({ onClick }) => (
          <Tooltip content={ `${ watchListId ? 'Remove address from Watch list' : 'Add address to Watch list' }` } disableOnMobile>
            <IconButton
              className={ className }
              aria-label="edit"
              variant="icon_background"
              size="md"
              selected={ Boolean(watchListId) }
              onClick={ onClick }
              onFocusCapture={ onFocusCapture }
            >
              <SpriteIcon name={ watchListId ? 'star_filled' : 'star_outline' }/>
            </IconButton>
          </Tooltip>
        ) }
      </AuthGuard>
      <WatchlistAddModal
        { ...addModalProps }
        isAdd
        onSuccess={ handleAddOrDeleteSuccess }
        data={ formData }
        hasEmail={ Boolean(profileQuery.data?.email) }
        showEmailAlert
      />
      { formData.id && (
        <DeleteAddressModal
          { ...deleteModalProps }
          data={ formData }
          onSuccess={ handleAddOrDeleteSuccess }
        />
      ) }
    </>
  );
};

export default chakra(AddressFavoriteButton);
