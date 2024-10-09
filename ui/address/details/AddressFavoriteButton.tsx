import { chakra, Tooltip, IconButton, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import { getResourceKey } from 'lib/api/useApiQuery';
import useIsAccountActionAllowed from 'lib/hooks/useIsAccountActionAllowed';
import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';
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
  const isAccountActionAllowed = useIsAccountActionAllowed();
  const onFocusCapture = usePreventFocusAfterModalClosing();

  const handleClick = React.useCallback(() => {
    if (!isAccountActionAllowed()) {
      return;
    }
    watchListId ? deleteModalProps.onOpen() : addModalProps.onOpen();
    !watchListId && mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Add to watchlist' });
  }, [ isAccountActionAllowed, watchListId, deleteModalProps, addModalProps ]);

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
      return;
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
          onClick={ handleClick }
          icon={ <IconSvg name={ watchListId ? 'star_filled' : 'star_outline' } boxSize={ 5 }/> }
          onFocusCapture={ onFocusCapture }
        />
      </Tooltip>
      <WatchlistAddModal
        { ...addModalProps }
        isAdd
        onClose={ handleAddModalClose }
        onSuccess={ handleAddOrDeleteSuccess }
        data={ formData }
      />
      { formData && (
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
