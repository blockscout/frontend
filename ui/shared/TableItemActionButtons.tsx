import { Tooltip, IconButton, HStack, Skeleton } from '@chakra-ui/react';
import React from 'react';

import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  onEditClick: () => void;
  onDeleteClick: () => void;
  isLoading?: boolean;
}

const TableItemActionButtons = ({ onEditClick, onDeleteClick, isLoading }: Props) => {
  const onFocusCapture = usePreventFocusAfterModalClosing();

  if (isLoading) {
    return (
      <HStack spacing={ 6 } alignSelf="flex-end">
        <Skeleton boxSize={ 5 } flexShrink={ 0 } borderRadius="sm"/>
        <Skeleton boxSize={ 5 } flexShrink={ 0 } borderRadius="sm"/>
      </HStack>
    );
  }

  return (
    <HStack spacing={ 6 } alignSelf="flex-end">
      <Tooltip label="Edit">
        <IconButton
          aria-label="edit"
          variant="simple"
          boxSize={ 5 }
          onClick={ onEditClick }
          icon={ <IconSvg name="edit" boxSize={ 5 }/> }
          onFocusCapture={ onFocusCapture }
          display="inline-block"
          flexShrink={ 0 }
          borderRadius="none"
        />
      </Tooltip>
      <Tooltip label="Delete">
        <IconButton
          aria-label="delete"
          variant="simple"
          boxSize={ 5 }
          onClick={ onDeleteClick }
          icon={ <IconSvg name="delete" boxSize={ 5 }/> }
          onFocusCapture={ onFocusCapture }
          display="inline-block"
          flexShrink={ 0 }
          borderRadius="none"
        />
      </Tooltip>
    </HStack>
  );
};

export default React.memo(TableItemActionButtons);
