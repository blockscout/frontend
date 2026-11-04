// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

const TokenEntityL1 = (props: TokenEntity.EntityProps) => {
  if (!parentChain) {
    return null;
  }

  return <TokenEntity.default { ...props } chain={ parentChain }/>;
};

export default TokenEntityL1;
