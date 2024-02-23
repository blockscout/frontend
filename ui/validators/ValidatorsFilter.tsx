import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import type { ValidatorsFilters } from 'types/api/validators';

import FilterButton from 'ui/shared/filters/FilterButton';

interface Props {
  isActive: boolean;
  defaultValue: ValidatorsFilters['state_filter'] | undefined;
  onChange: (nextValue: string | Array<string>) => void;
}

const ValidatorsFilter = ({ onChange, defaultValue, isActive }: Props) => {
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
        <MenuOptionGroup defaultValue={ defaultValue || 'all' } title="Status" type="radio" onChange={ onChange }>
          <MenuItemOption value="all">All</MenuItemOption>
          <MenuItemOption value="active">Active</MenuItemOption>
          <MenuItemOption value="probation">Probation</MenuItemOption>
          <MenuItemOption value="inactive">Failed</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default React.memo(ValidatorsFilter);
