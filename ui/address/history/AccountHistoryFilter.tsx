import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import type { HistorySentReceivedFilter } from 'types/translateApi';

import Check from 'icons/check.svg';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import Icon from 'ui/shared/chakra/Icon';
import FilterButton from 'ui/shared/filters/FilterButton';

interface Props {
  isActive: boolean;
  defaultFilter: HistorySentReceivedFilter;
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
          border={ isOpen }
        />
      </MenuButton>
      <MenuList zIndex={ 2 }>
        <MenuOptionGroup defaultValue={ defaultFilter || 'all' } type="radio" onChange={ onFilterChange }>
          <MenuItemOption
            value="all"
            flexDir="row-reverse"
            icon={ (
              <Icon as={ Check }
                color="blue.600"
                boxSize="18px"/>
            ) }
          >
            All
          </MenuItemOption>
          <MenuItemOption
            value="received"
            flexDir="row-reverse"
            icon={ (
              <Icon as={ Check }
                color="blue.600"
                boxSize="18px"/>
            ) }
          >
            Received from
          </MenuItemOption>
          <MenuItemOption
            value="sent"
            flexDir="row-reverse"
            icon={ (
              <Icon as={ Check }
                color="blue.600"
                boxSize="18px"/>
            ) }
          >
            Sent to
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default React.memo(AccountHistoryFilter);
