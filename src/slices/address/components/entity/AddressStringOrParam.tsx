// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from './AddressEntity';
import type { EntityProps } from './AddressEntity';

type Props = Omit<EntityProps, 'address'> & {
  address: string | schemas['Address'];
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
