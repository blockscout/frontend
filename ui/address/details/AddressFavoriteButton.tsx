import { chakra, Tooltip, IconButton, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import { getResourceKey } from 'lib/api/useApiQuery';
import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';
import AuthGuard from 'ui/snippets/auth/AuthGuard';
import WatchlistAddModal from 'ui/watchlist/AddressModal/AddressModal';
import DeleteAddressModal from 'ui/watchlist/DeleteAddressModal';

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

  const handleAddToFavorite = React.useCallback(() => {
    watchListId ? deleteModalProps.onOpen() : addModalProps.onOpen();
    !watchListId && mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Add to watchlist' });
  }, [ watchListId, deleteModalProps, addModalProps ]);

  const handleAddOrDeleteSuccess = React.useCallback(async() => {
    const queryKey = getResourceKey('address', { pathParams: { hash: router.query.hash?.toString() } });
    await queryClient.refetchQueries({ queryKey });
    addModalProps.onClose();
  }, [ addModalProps, queryClient, router.query.hash ]);

  const handleAddModalClose = React.useCallback(() => {
    addModalProps.onClose();
  }, [ addModalProps ]);

  const handleDeleteModalClose = React.useCallback(() => {
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

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
          <Tooltip label={ `${ watchListId ? 'Remove address from Watch list' : 'Add address to Watch list' }` }>
            <IconButton
              isActive={ Boolean(watchListId) }
              className={ className }
              aria-label="edit"
              variant="outline"
              size="sm"
              pl="6px"
              pr="6px"
              flexShrink={ 0 }
              onClick={ onClick }
              icon={ <IconSvg name={ watchListId ? 'star_filled' : 'star_outline' } boxSize={ 5 }/> }
              onFocusCapture={ onFocusCapture }
            />
          </Tooltip>
        ) }
      </AuthGuard>
      <WatchlistAddModal
        { ...addModalProps }
        isAdd
        onClose={ handleAddModalClose }
        onSuccess={ handleAddOrDeleteSuccess }
        data={ formData }
      />
      { formData.id && (
        <DeleteAddressModal
          { ...deleteModalProps }
          onClose={ handleDeleteModalClose }
          data={ formData }
          onSuccess={ handleAddOrDeleteSuccess }
        />
      ) }
    </>
  );
};

export default chakra(AddressFavoriteButton);
