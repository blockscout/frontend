import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import type { NovesHistoryFilterValue } from 'types/api/noves';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import FilterButton from 'ui/shared/filters/FilterButton';

interface Props {
  isActive: boolean;
  defaultFilter: NovesHistoryFilterValue;
  onFilterChange: (nextValue: string | Array<string>) => void;
  isLoading?: boolean;
}

const AccountHistoryFilter = ({ onFilterChange, defaultFilter, isActive, isLoading }: Props) => {
  const { isOpen, onToggle } = useDisclosure();
  const isInitialLoading = useIsInitialLoading(isLoading);

  const onCloseMenu = React.useCallback(() => {
    if (isOpen) {
      onToggle();
    }
  }, [ isOpen, onToggle ]);

  return (
    <Menu isOpen={ isOpen } onClose={ onCloseMenu }>
      <MenuButton onClick={ onToggle }>
        <FilterButton
          isActive={ isOpen || isActive }
          isLoading={ isInitialLoading }
          onClick={ onToggle }
          appliedFiltersNum={ isActive ? 1 : 0 }
          as="div"
        />
      </MenuButton>
      <MenuList zIndex={ 2 }>
        <MenuOptionGroup defaultValue={ defaultFilter || 'all' } type="radio" onChange={ onFilterChange }>
          <MenuItemOption value="all">All</MenuItemOption>
          <MenuItemOption value="received">Received from</MenuItemOption>
          <MenuItemOption value="sent">Sent to</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default React.memo(AccountHistoryFilter);
