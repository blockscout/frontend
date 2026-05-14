// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressParamBasic } from 'client/slices/address/types/api';

import AddressEntity from './AddressEntity';
import type { EntityProps } from './AddressEntity';

type Props = Omit<EntityProps, 'address'> & {
  address: string | AddressParamBasic;
};

const AddressStringOrParam = ({ address, ...props }: Props) => {
  let addressParam;
  if (typeof address === 'string') {
    addressParam = { hash: address };
  } else {
    addressParam = address;
  }

  return <AddressEntity address={ addressParam } { ...props }/>;
};

export default AddressStringOrParam;
