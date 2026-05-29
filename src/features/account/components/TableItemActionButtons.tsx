// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import usePreventFocusAfterModalClosing from 'src/shared/hooks/usePreventFocusAfterModalClosing';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

type Props = {
  onEditClick: () => void;
  onDeleteClick: () => void;
  isLoading?: boolean;
};

const TableItemActionButtons = ({ onEditClick, onDeleteClick, isLoading }: Props) => {
  const onFocusCapture = usePreventFocusAfterModalClosing();

  return (
    <HStack gap={ 6 } alignSelf="flex-end">
      <Tooltip content="Edit" disableOnMobile>
        <IconButton
          aria-label="edit"
          variant="link"
          size="2xs"
          onClick={ onEditClick }
          onFocusCapture={ onFocusCapture }
          loadingSkeleton={ isLoading }
          borderRadius="none"
        >
          <SpriteIcon name="edit"/>
        </IconButton>
      </Tooltip>
      <Tooltip content="Delete" disableOnMobile>
        <IconButton
          aria-label="delete"
          variant="link"
          size="2xs"
          onClick={ onDeleteClick }
          onFocusCapture={ onFocusCapture }
          loadingSkeleton={ isLoading }
          borderRadius="none"
        >
          <SpriteIcon name="delete"/>
        </IconButton>
      </Tooltip>
    </HStack>
  );
};

export default React.memo(TableItemActionButtons);
