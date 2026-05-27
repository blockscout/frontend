// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import * as BlockEntity from 'client/slices/block/components/entity/BlockEntity';

const rollupFeature = config.features.rollup;

const BlockEntityL2 = (props: BlockEntity.EntityProps) => {
  if (!rollupFeature.isEnabled) {
    return null;
  }

  return <BlockEntity.default { ...props } icon={{ name: 'txn_batches' }}/>;
};

export default chakra(BlockEntityL2);
