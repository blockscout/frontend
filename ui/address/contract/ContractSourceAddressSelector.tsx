import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import Skeleton from 'ui/shared/chakra/Skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import LinkNewTab from 'ui/shared/links/LinkNewTab';
import Select from 'ui/shared/select/Select';

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

  const handleItemSelect = React.useCallback((value: string) => {
    const nextOption = items.find(({ address }) => address === value);
    if (nextOption) {
      onItemSelect(nextOption);
    }
  }, [ items, onItemSelect ]);

  const options = React.useMemo(() => {
    return items.map(({ address, name }) => ({ label: name || address, value: address }));
  }, [ items ]);

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
        options={ options }
        name="contract-source-address"
        defaultValue={ selectedItem.address }
        onChange={ handleItemSelect }
        isLoading={ isLoading }
        maxW={{ base: '180px', lg: 'none' }}
        fontWeight={ 600 }
      />
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
