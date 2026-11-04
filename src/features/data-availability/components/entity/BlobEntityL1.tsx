// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import type { EntityProps } from './BlobEntity';
import BlobEntity from './BlobEntity';

const BlobEntityL1 = (props: EntityProps) => {
  if (!parentChain) {
    return null;
  }

  return <BlobEntity { ...props } chain={ parentChain }/>;
};

export default BlobEntityL1;
