import {
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
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
          onClick={ onToggle }
          as="div"
        />
      </MenuButton>
      <MenuList zIndex="popover" bgColor="bg_base" borderColor="divider">
        <MenuOptionGroup defaultValue={ defaultValue || 'all' } title="Filter" type="radio" onChange={ onChange }>
          <MenuItemOption value="all" bgColor="bg_base" borderColor="divider" _hover={{
            bgColor: 'divider',
          }}>All</MenuItemOption>
          <MenuItemOption value="solidity" bgColor="bg_base" borderColor="divider" _hover={{
            bgColor: 'divider',
          }}>Solidity</MenuItemOption>
          <MenuItemOption value="vyper" bgColor="bg_base" borderColor="divider" _hover={{
            bgColor: 'divider',
          }}>Vyper</MenuItemOption>
          <MenuItemOption value="yul" bgColor="bg_base" borderColor="divider" _hover={{
            bgColor: 'divider',
          }}>Yul</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default React.memo(VerifiedContractsFilter);
