// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import React from 'react';

import config from 'client/config';
import SpriteIcon from 'client/sprite/SpriteIcon';

import { Tooltip } from 'toolkit/chakra/tooltip';

interface Props extends BoxProps {
  view?: 'block' | 'tx';
}

const BlockPendingUpdateHint = ({ view = 'block', ...props }: Props) => {
  if (!config.slices.block.pendingUpdateAlertEnabled) {
    return null;
  }

  const tooltipContent = view === 'block' ?
    'Block is being re-synced. Details may be incomplete until the update is finished.' :
    'This transaction is part of a block that is being re-synced. Details may be incomplete until the update is finished.';

  return (
    <Tooltip content={ tooltipContent }>
      <SpriteIcon boxSize={ 5 } color="icon.secondary" name="status/warning" { ...props }/>
    </Tooltip>
  );
};

export default React.memo(BlockPendingUpdateHint);
