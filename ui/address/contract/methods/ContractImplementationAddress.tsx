import { Flex, Select, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AddressImplementation } from 'types/api/addressParams';

import { route } from 'nextjs-routes';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import LinkNewTab from 'ui/shared/links/LinkNewTab';

interface Props {
  selectedItem: AddressImplementation;
  onItemSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  implementations: Array<AddressImplementation>;
  isLoading?: boolean;
}

const ContractImplementationAddress = ({ selectedItem, onItemSelect, implementations, isLoading }: Props) => {

  if (isLoading) {
    return <Skeleton mb={ 6 } h={ 6 } w={{ base: '300px', lg: '500px' }}/>;
  }

  if (implementations.length === 0) {
    return null;
  }

  if (implementations.length === 1) {
    return (
      <Flex mb={ 6 } flexWrap="wrap" columnGap={ 2 } rowGap={ 2 }>
        <span>Implementation address:</span>
        <AddressEntity
          address={{ hash: implementations[0].address, is_contract: true, is_verified: true }}
        />
      </Flex>
    );
  }

  return (
    <Flex mb={ 6 } flexWrap="wrap" columnGap={ 2 } rowGap={ 2 } alignItems="center">
      <span>Implementation address:</span>
      <Select
        size="xs"
        value={ selectedItem.address }
        onChange={ onItemSelect }
        w="auto"
        fontWeight={ 600 }
        borderRadius="base"
      >
        { implementations.map((implementation) => (
          <option key={ implementation.address } value={ implementation.address }>
            { implementation.name }
          </option>
        )) }
      </Select>
      <CopyToClipboard text={ selectedItem.address } ml={ 1 }/>
      <LinkNewTab
        label="Open contract details page in new tab"
        href={ route({ pathname: '/address/[hash]', query: { hash: selectedItem.address, tab: 'contract' } }) }
      />
    </Flex>
  );
};

export default React.memo(ContractImplementationAddress);
