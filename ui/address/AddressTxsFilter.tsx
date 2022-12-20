import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';

import FilterButton from 'ui/shared/FilterButton';

interface Props {
  isActive: boolean;
  defaultFilter: AddressFromToFilter;
  onFilterChange: (nextValue: string | Array<string>) => void;
}

const AddressTxsFilter = ({ onFilterChange, defaultFilter, isActive }: Props) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Menu>
      <MenuButton>
        <FilterButton
          isActive={ isOpen || isActive }
          onClick={ onToggle }
        />
      </MenuButton>
      <MenuList zIndex={ 2 }>
        <MenuOptionGroup defaultValue={ defaultFilter || 'all' } title="Address" type="radio" onChange={ onFilterChange }>
          <MenuItemOption value="all">All</MenuItemOption>
          <MenuItemOption value="from">From</MenuItemOption>
          <MenuItemOption value="to">To</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default React.memo(AddressTxsFilter);
