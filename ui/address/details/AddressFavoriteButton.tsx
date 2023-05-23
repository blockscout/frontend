import { Icon, chakra, Tooltip, IconButton, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import starFilledIcon from 'icons/star_filled.svg';
import starOutlineIcon from 'icons/star_outline.svg';
import type { ResourceError } from 'lib/api/resources';
import { resourceKey } from 'lib/api/resources';
import { getResourceKey } from 'lib/api/useApiQuery';
import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import useRedirectIfNotAuth from 'lib/hooks/useRedirectIfNotAuth';
import useToast from 'lib/hooks/useToast';
import WatchlistAddModal from 'ui/watchlist/AddressModal/AddressModal';
import DeleteAddressModal from 'ui/watchlist/DeleteAddressModal';

interface Props {
  className?: string;
  hash: string;
  watchListId: number | null;
}

const AddressFavoriteButton = ({ className, hash, watchListId }: Props) => {
  const addModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  const redirectIfNotAuth = useRedirectIfNotAuth();

  const profileState = queryClient.getQueryState<unknown, ResourceError<{ message: string }>>([ resourceKey('user_info') ]);

  const handleClick = React.useCallback(() => {
    if (profileState?.error?.status === 403) {
      const isUnverifiedEmail = profileState.error.payload?.message.includes('Unverified email');
      if (isUnverifiedEmail) {
        toast({
          position: 'top-right',
          title: 'Error',
          description: 'Unable to add address to watch list. Please go to the watch list page instead.',
          status: 'error',
          variant: 'subtle',
          isClosable: true,
        });
        return;
      }
    }

    if (redirectIfNotAuth()) {
      return;
    }
    watchListId ? deleteModalProps.onOpen() : addModalProps.onOpen();
  }, [ profileState, redirectIfNotAuth, watchListId, deleteModalProps, addModalProps, toast ]);

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
    return {
      address_hash: hash,
      id: String(watchListId),
    };
  }, [ hash, watchListId ]);

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
          onClick={ handleClick }
          icon={ <Icon as={ watchListId ? starFilledIcon : starOutlineIcon } boxSize={ 5 }/> }
          onFocusCapture={ usePreventFocusAfterModalClosing() }
        />
      </Tooltip>
      <WatchlistAddModal
        { ...addModalProps }
        isAdd
        onClose={ handleAddModalClose }
        onSuccess={ handleAddOrDeleteSuccess }
        data={ formData }
      />
      <DeleteAddressModal
        { ...deleteModalProps }
        onClose={ handleDeleteModalClose }
        data={ formData }
        onSuccess={ handleAddOrDeleteSuccess }
      />
    </>
  );
};

export default chakra(AddressFavoriteButton);
