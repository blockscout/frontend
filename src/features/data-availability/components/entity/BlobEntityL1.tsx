// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { parentChainAsEntityChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import config from 'src/config';

import type { EntityProps } from './BlobEntity';
import BlobEntity from './BlobEntity';

const rollupFeature = config.features.rollup;

const BlobEntityL1 = (props: EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  return <BlobEntity { ...props } chain={ parentChainAsEntityChain(rollupFeature.parentChain) }/>;
};

export default BlobEntityL1;
