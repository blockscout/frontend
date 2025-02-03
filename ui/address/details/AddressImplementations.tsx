import React from 'react';

import type { AddressImplementation } from 'types/api/addressParams';
import type { SmartContractProxyType } from 'types/api/contract';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  data: Array<AddressImplementation>;
  isLoading?: boolean;
  proxyType?: SmartContractProxyType;
}

const AddressImplementations = ({ data, isLoading, proxyType }: Props) => {
  const hasManyItems = data.length > 1;
  const [ hasScroll, setHasScroll ] = React.useState(false);

  const text = proxyType === 'eip7702' ? 'Delegated to' : `Implementation${ hasManyItems ? 's' : '' }`;
  const hint = proxyType === 'eip7702' ?
    'Account\'s executable code address' :
    `Implementation${ hasManyItems ? 's' : '' } address${ hasManyItems ? 'es' : '' } of the proxy contract`;

  return (
    <>
      <DetailsInfoItem.Label
        hint={ hint }
        isLoading={ isLoading }
        hasScroll={ hasScroll }
      >
        { text }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.ValueWithScroll
        gradientHeight={ 48 }
        onScrollVisibilityChange={ setHasScroll }
        rowGap={ 2 }
        maxH="200px"
      >
        { data.map((item) => (
          <AddressEntity
            key={ item.address }
            address={{
              hash: item.address,
              filecoin: { robust: item.filecoin_robust_address },
              name: item.name,
              is_contract: true,
            }}
            isLoading={ isLoading }
            noIcon
          />
        )) }
      </DetailsInfoItem.ValueWithScroll>
    </>
  );
};

export default React.memo(AddressImplementations);
