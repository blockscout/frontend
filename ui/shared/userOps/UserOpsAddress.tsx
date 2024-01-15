import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import AddressEntity from '../entities/address/AddressEntity';
import type { EntityProps } from '../entities/address/AddressEntity';

type Props = Omit<EntityProps, 'address'> & {
  address: string | AddressParam;
}

const UserOpsAddress = ({ address, ...props }: Props) => {
  let addressParam;
  if (typeof address === 'string') {
    addressParam = { hash: address };
  } else {
    addressParam = address;
  }

  return <AddressEntity address={ addressParam } { ...props }/>;
};

export default UserOpsAddress;
