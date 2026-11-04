// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

const TxEntityL1 = (props: TxEntity.EntityProps) => {
  if (!parentChain) {
    return null;
  }

  return <TxEntity.default { ...props } chain={ parentChain }/>;
};

export default TxEntityL1;
