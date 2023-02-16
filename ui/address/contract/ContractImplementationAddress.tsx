import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { Address as TAddress } from 'types/api/address';

import { getResourceKey } from 'lib/api/useApiQuery';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';

interface Props {
  hash: string | undefined;
}

const ContractImplementationAddress = ({ hash }: Props) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<TAddress>(getResourceKey('address', {
    pathParams: { hash },
  }));

  if (!data?.implementation_address) {
    return null;
  }

  return (
    <Address whiteSpace="pre-wrap" flexWrap="wrap" mb={ 6 }>
      <span>Implementation address: </span>
      <AddressLink type="address" hash={ data.implementation_address }/>
    </Address>
  );
};

export default React.memo(ContractImplementationAddress);
