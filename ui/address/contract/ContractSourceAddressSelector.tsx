import { chakra, Flex, Select, Skeleton } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import LinkNewTab from 'ui/shared/links/LinkNewTab';

export interface Item {
  address: string;
  name?: string | null | undefined;
}

interface Props {
  className?: string;
  label: string;
  selectedItem: Item;
  onItemSelect: (item: Item) => void;
  items: Array<Item>;
  isLoading?: boolean;
}

const ContractSourceAddressSelector = ({ className, selectedItem, onItemSelect, items, isLoading, label }: Props) => {

  const handleItemSelect = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextOption = items.find(({ address }) => address === event.target.value);
    if (nextOption) {
      onItemSelect(nextOption);
    }
  }, [ items, onItemSelect ]);

  if (isLoading) {
    return <Skeleton h={ 6 } w={{ base: '300px', lg: '500px' }} className={ className }/>;
  }

  if (items.length === 0) {
    return null;
  }

  if (items.length === 1) {
    return (
      <Flex flexWrap="wrap" columnGap={ 3 } rowGap={ 2 } className={ className }>
        <chakra.span fontWeight={ 500 } fontSize="sm">{ label }</chakra.span>
        <AddressEntity
          address={{ hash: items[0].address, is_contract: true, is_verified: true }}
        />
      </Flex>
    );
  }

  return (
    <Flex columnGap={ 3 } rowGap={ 2 } alignItems="center" className={ className }>
      <chakra.span fontWeight={ 500 } fontSize="sm">{ label }</chakra.span>
      <Select
        size="xs"
        value={ selectedItem.address }
        onChange={ handleItemSelect }
        w="auto"
        fontWeight={ 600 }
        borderRadius="base"
      >
        { items.map((item) => (
          <option key={ item.address } value={ item.address }>
            { item.name }
          </option>
        )) }
      </Select>
      <Flex columnGap={ 2 } alignItems="center">
        <CopyToClipboard text={ selectedItem.address } ml={ 0 }/>
        <LinkNewTab
          label="Open contract details page in new tab"
          href={ route({ pathname: '/address/[hash]', query: { hash: selectedItem.address, tab: 'contract' } }) }
        />
      </Flex>
    </Flex>
  );
};

export default React.memo(chakra(ContractSourceAddressSelector));
