import { Tooltip, IconButton, Icon, HStack } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import DeleteIcon from 'icons/delete.svg';
import EditIcon from 'icons/edit.svg';

type Props = {
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const TableItemActionButtons = ({ onEditClick, onDeleteClick }: Props) => {
  // prevent set focus on button when closing modal
  const onFocusCapture = useCallback((e: React.SyntheticEvent) => e.stopPropagation(), []);

  return (
    <HStack spacing={ 6 } alignSelf="flex-end">
      <Tooltip label="Edit">
        <IconButton
          aria-label="edit"
          variant="icon"
          w="30px"
          h="30px"
          onClick={ onEditClick }
          icon={ <Icon as={ EditIcon } w="20px" h="20px"/> }
          onFocusCapture={ onFocusCapture }
        />
      </Tooltip>
      <Tooltip label="Delete">
        <IconButton
          aria-label="delete"
          variant="icon"
          w="30px"
          h="30px"
          onClick={ onDeleteClick }
          icon={ <Icon as={ DeleteIcon } w="20px" h="20px"/> }
          onFocusCapture={ onFocusCapture }
        />
      </Tooltip>
    </HStack>
  );
};

export default React.memo(TableItemActionButtons);
