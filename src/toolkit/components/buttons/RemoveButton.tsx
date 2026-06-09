// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import type { IconButtonProps } from 'src/toolkit/chakra/icon-button';
import { IconButton } from 'src/toolkit/chakra/icon-button';

interface Props extends IconButtonProps {}

const RemoveButton = (props: Props) => {
  return (
    <IconButton
      aria-label="Remove item"
      variant="icon_secondary"
      size="md"
      { ...props }
    >
      <SpriteIcon name="minus"/>
    </IconButton>
  );
};

export default React.memo(RemoveButton);
