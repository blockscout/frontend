// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

const AddressEntityL1 = (props: AddressEntity.EntityProps) => {
  if (!parentChain) {
    return null;
  }

  return <AddressEntity.default { ...props } chain={ parentChain }/>;
};

export default AddressEntityL1;
