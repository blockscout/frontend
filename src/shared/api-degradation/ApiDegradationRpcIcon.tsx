// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';
import type { IconName, Props as SpriteIconProps } from 'src/sprite/SpriteIcon';

import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props extends Omit<SpriteIconProps, 'name'> {
  name?: IconName;
}

const ApiDegradationRpcIcon = (props: Props) => {
  return (
    <Tooltip content="Our indexer is experiencing problems, you see the data directly from RPC">
      <SpriteIcon name="RPC" color="orange.400" boxSize={ 5 } { ...props }/>
    </Tooltip>
  );
};

export default React.memo(ApiDegradationRpcIcon);
