import { HStack } from '@chakra-ui/react';
import React from 'react';

import usePreventFocusAfterModalClosing from 'lib/hooks/usePreventFocusAfterModalClosing';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  onEditClick: () => void;
  onDeleteClick: () => void;
  isLoading?: boolean;
};

const TableItemActionButtons = ({ onEditClick, onDeleteClick, isLoading }: Props) => {
  const onFocusCapture = usePreventFocusAfterModalClosing();

  return (
    <HStack gap={ 6 } alignSelf="flex-end">
      <Tooltip content="Edit">
        <IconButton
          aria-label="edit"
          variant="link"
          onClick={ onEditClick }
          onFocusCapture={ onFocusCapture }
          loading={ isLoading }
          display="inline-block"
          flexShrink={ 0 }
          borderRadius="none"
        >
          <IconSvg name="edit" boxSize={ 5 }/>
        </IconButton>
      </Tooltip>
      <Tooltip content="Delete">
        <IconButton
          aria-label="delete"
          variant="link"
          onClick={ onDeleteClick }
          onFocusCapture={ onFocusCapture }
          loading={ isLoading }
          display="inline-block"
          flexShrink={ 0 }
          borderRadius="none"
        >
          <IconSvg name="delete" boxSize={ 5 }/>
        </IconButton>
      </Tooltip>
    </HStack>
  );
};

export default React.memo(TableItemActionButtons);
