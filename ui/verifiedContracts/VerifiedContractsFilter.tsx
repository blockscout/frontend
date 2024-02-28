import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import type { VerifiedContractsFilters } from 'types/api/contracts';

import FilterButton from 'ui/shared/filters/FilterButton';

interface Props {
  isActive: boolean;
  defaultValue: VerifiedContractsFilters['filter'] | undefined;
  onChange: (nextValue: string | Array<string>) => void;
}

const VerifiedContractsFilter = ({ onChange, defaultValue, isActive }: Props) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Menu>
      <MenuButton>
        <FilterButton
          isActive={ isOpen || isActive }
          appliedFiltersNum={ isActive ? 1 : 0 }
          onClick={ onToggle }
          as="div"
        />
      </MenuButton>
      <MenuList zIndex="popover">
        <MenuOptionGroup defaultValue={ defaultValue || 'all' } title="Filter" type="radio" onChange={ onChange }>
          <MenuItemOption value="all">All</MenuItemOption>
          <MenuItemOption value="solidity">Solidity</MenuItemOption>
          <MenuItemOption value="vyper">Vyper</MenuItemOption>
          <MenuItemOption value="yul">Yul</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default React.memo(VerifiedContractsFilter);
