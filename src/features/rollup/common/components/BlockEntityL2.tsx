// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import * as BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import config from 'src/config';

const rollupFeature = config.features.rollup;

const BlockEntityL2 = (props: BlockEntity.EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  return <BlockEntity.default { ...props } icon={{ name: 'txn_batches' }}/>;
};

export default chakra(BlockEntityL2);
