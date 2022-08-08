import { Tooltip, IconButton, Icon } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import DeleteIcon from 'icons/delete.svg';

type Props = {
  onClick: () => void;
}

const DeleteButton = ({ onClick }: Props) => {
  const onFocusCapture = useCallback((e: React.SyntheticEvent) => e.stopPropagation(), []);
  return (
    <Tooltip label="Delete">
      <IconButton
        aria-label="delete"
        variant="icon"
        w="30px"
        h="30px"
        onClick={ onClick }
        icon={ <Icon as={ DeleteIcon } w="20px" h="20px"/> }
        onFocusCapture={ onFocusCapture }
      />
    </Tooltip>
  );
};

export default DeleteButton;
