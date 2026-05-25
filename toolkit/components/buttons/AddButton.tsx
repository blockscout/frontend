// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import SpriteIcon from 'client/sprite/SpriteIcon';

import type { IconButtonProps } from 'toolkit/chakra/icon-button';
import { IconButton } from 'toolkit/chakra/icon-button';

interface Props extends IconButtonProps {}

const AddButton = (props: Props) => {
  return (
    <IconButton
      aria-label="Add item"
      variant="icon_secondary"
      size="md"
      { ...props }
    >
      <SpriteIcon name="plus"/>
    </IconButton>
  );
};

export default React.memo(AddButton);
