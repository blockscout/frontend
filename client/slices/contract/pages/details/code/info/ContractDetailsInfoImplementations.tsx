// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressImplementation } from 'client/slices/address/types/api';
import type { SmartContractProxyType } from 'client/slices/contract/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';

import ContainerWithScrollY from 'ui/shared/ContainerWithScrollY';

import ContractDetailsInfoItem from './ContractDetailsInfoItem';

interface Props {
  implementations: Array<AddressImplementation>;
  proxyType?: SmartContractProxyType;
}

const ContractDetailsInfoImplementations = ({ implementations, proxyType }: Props) => {
  return (
    <ContractDetailsInfoItem
      label={ `${ proxyType === 'eip7702' ? 'Delegated to' : `Implementation${ implementations.length > 1 ? 's' : '' }` }` }
      contentProps={{ gridColumn: { lg: '2 / span 3' }, position: 'relative' }}
    >
      <ContainerWithScrollY gradientHeight={ 48 } maxH="200px" w="100%">
        { implementations.map((item) => (
          <AddressEntity
            key={ item.address_hash }
            address={{
              hash: item.address_hash,
              filecoin: { robust: item.filecoin_robust_address },
              name: item.name,
              is_contract: true,
            }}
            noIcon
          />
        )) }
      </ContainerWithScrollY>
    </ContractDetailsInfoItem>
  );
};

export default React.memo(ContractDetailsInfoImplementations);
