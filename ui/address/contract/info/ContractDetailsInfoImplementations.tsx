import type { BoxProps } from '@chakra-ui/react';
import React from 'react';

import type { AddressImplementation } from 'types/api/addressParams';
import type { SmartContractProxyType } from 'types/api/contract';

import ContainerWithScrollY from 'ui/shared/ContainerWithScrollY';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import ContractDetailsInfoItem from './ContractDetailsInfoItem';

interface Props {
  implementations: Array<AddressImplementation>;
  proxyType?: SmartContractProxyType;
  isLoading: boolean;
  labelProps?: BoxProps;
}

const ContractDetailsInfoImplementations = ({ implementations, proxyType, isLoading, labelProps }: Props) => {
  return (
    <ContractDetailsInfoItem
      label={ `${ proxyType === 'eip7702' ? 'Delegated to' : `Implementation${ implementations.length > 1 ? 's' : '' }` }` }
      isLoading={ isLoading }
      labelProps={ labelProps }
      contentProps={{ maxW: 'calc(100% - 194px)', position: 'relative' }}
    >
      <ContainerWithScrollY gradientHeight={ 48 } maxH="200px">
        { implementations.map((item) => (
          <AddressEntity
            key={ item.address_hash }
            address={{
              hash: item.address_hash,
              filecoin: { robust: item.filecoin_robust_address },
              name: item.name,
              is_contract: true,
            }}
            isLoading={ isLoading }
            noIcon
          />
        )) }
      </ContainerWithScrollY>
    </ContractDetailsInfoItem>
  );
};

export default React.memo(ContractDetailsInfoImplementations);
