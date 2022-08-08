import { Tooltip, IconButton, Icon } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import EditIcon from 'icons/edit.svg';

type Props = {
  onClick: () => void;
}

const EditButton = ({ onClick }: Props) => {
  const onFocusCapture = useCallback((e: React.SyntheticEvent) => e.stopPropagation(), []);
  return (
    <Tooltip label="Edit">
      <IconButton
        aria-label="edit"
        variant="icon"
        w="30px"
        h="30px"
        onClick={ onClick }
        icon={ <Icon as={ EditIcon } w="20px" h="20px"/> }
        onFocusCapture={ onFocusCapture }
      />
    </Tooltip>
  );
};

export default EditButton;
