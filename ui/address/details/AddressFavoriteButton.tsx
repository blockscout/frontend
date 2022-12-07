import { Icon, chakra, Tooltip, IconButton, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import starFilledIcon from 'icons/star_filled.svg';
import starOutlineIcon from 'icons/star_outline.svg';
import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import WatchlistAddModal from 'ui/watchlist/AddressModal/AddressModal';
import DeleteAddressModal from 'ui/watchlist/DeleteAddressModal';

interface Props {
  className?: string;
  hash: string;
  isAdded: boolean;
}

const AddressFavoriteButton = ({ className, hash, isAdded }: Props) => {
  const addModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();

  const handleClick = React.useCallback(() => {
    isAdded ? deleteModalProps.onOpen() : addModalProps.onOpen();
  }, [ addModalProps, deleteModalProps, isAdded ]);

  const handleAddModalClose = React.useCallback(() => {
    addModalProps.onClose();
  }, [ addModalProps ]);

  const handleDeleteModalClose = React.useCallback(() => {
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const formData = React.useMemo(() => {
    return { address_hash: hash, id: '1' };
  }, [ hash ]);

  return (
    <>
      <Tooltip label={ `${ isAdded ? 'Remove address from Watch list' : 'Add address to Watch list' }` }>
        <IconButton
          className={ className }
          aria-label="edit"
          variant="outline"
          size="sm"
          pl={ 2 }
          pr={ 2 }
          onClick={ handleClick }
          icon={ <Icon as={ isAdded ? starFilledIcon : starOutlineIcon } boxSize={ 5 }/> }
          onFocusCapture={ usePreventFocusAfterModalClosing() }
        />
      </Tooltip>
      <WatchlistAddModal { ...addModalProps } onClose={ handleAddModalClose } data={ formData } isAdd/>
      <DeleteAddressModal { ...deleteModalProps } onClose={ handleDeleteModalClose } data={ formData }/>
    </>
  );
};

export default chakra(AddressFavoriteButton);
