import { Tooltip, IconButton, Icon, HStack } from '@chakra-ui/react';
import React from 'react';

import DeleteIcon from 'icons/delete.svg';
import EditIcon from 'icons/edit.svg';
import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';

type Props = {
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const TableItemActionButtons = ({ onEditClick, onDeleteClick }: Props) => {
  const onFocusCapture = usePreventFocusAfterModalClosing();

  return (
    <HStack spacing={ 6 } alignSelf="flex-end">
      <Tooltip label="Edit">
        <IconButton
          aria-label="edit"
          variant="simple"
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
          variant="simple"
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
