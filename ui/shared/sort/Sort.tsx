import {
  chakra,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import SortButton from './SortButton';

export interface Option<Sort extends string> {
  title: string;
  id: Sort | undefined;
}

interface Props<Sort extends string> {
  options: Array<Option<Sort>>;
  sort: Sort | undefined;
  setSort: (value: Sort | undefined) => void;
  isLoading?: boolean;
}

const Sort = <Sort extends string>({ sort, setSort, options, isLoading }: Props<Sort>) => {
  const { isOpen, onToggle } = useDisclosure();

  const setSortingFromMenu = React.useCallback((val: string | Array<string>) => {
    const value = val as Sort | Array<Sort>;
    setSort(Array.isArray(value) ? value[0] : value);
  }, [ setSort ]);

  return (
    <Menu>
      <MenuButton as="div">
        <SortButton
          isActive={ isOpen || Boolean(sort) }
          onClick={ onToggle }
          isLoading={ isLoading }
        />
      </MenuButton>
      <MenuList minWidth="240px" zIndex="popover">
        <MenuOptionGroup value={ sort } title="Sort by" type="radio" onChange={ setSortingFromMenu }>
          { options.map((option) => (
            <MenuItemOption
              key={ option.id || 'default' }
              value={ option.id }
            >
              { option.title }
            </MenuItemOption>
          )) }
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default React.memo(chakra(Sort)) as typeof Sort;
