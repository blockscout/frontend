// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

const BlockEntityL1 = (props: BlockEntity.EntityProps) => {
  if (!parentChain) {
    return null;
  }

  return <BlockEntity.default { ...props } chain={ parentChain }/>;
};

export default BlockEntityL1;
