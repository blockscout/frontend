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

import type { Sort } from 'types/client/txs-sort';

import SortButton from 'ui/shared/SortButton';

interface Props {
  isActive: boolean;
  sorting: Sort;
  setSorting: (val: Sort) => void;
}

const SORT_OPTIONS = [
  { title: 'Default', id: '' },
  { title: 'Value ascending', id: 'val-asc' },
  { title: 'Value descending', id: 'val-desc' },
  { title: 'Fee ascending', id: 'fee-asc' },
  { title: 'Fee descending', id: 'fee-desc' },
];

const TxsSorting = ({ isActive, sorting, setSorting }: Props) => {
  const { isOpen, onToggle } = useDisclosure();

  const setSortingFromMenu = React.useCallback((val: string | Array<string>) => {
    const value = val as Sort | Array<Sort>;
    setSorting(Array.isArray(value) ? value[0] : value);
  }, [ setSorting ]);

  return (
    <Menu>
      <MenuButton>
        <SortButton
          isActive={ isOpen || isActive }
          onClick={ onToggle }
        />
      </MenuButton>
      <MenuList minWidth="240px">
        <MenuOptionGroup value={ sorting } title="Sort by" type="radio" onChange={ setSortingFromMenu }>
          { SORT_OPTIONS.map((option) => (
            <MenuItemOption
              key={ option.id }
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

export default chakra(TxsSorting);
