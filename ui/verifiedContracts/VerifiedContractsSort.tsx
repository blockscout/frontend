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

import SortButton from 'ui/shared/SortButton';

import type { Sort } from './utils';

interface Props {
  isActive: boolean;
  sort: Sort | undefined;
  setSort: (val: Sort | undefined) => void;
}

const SORT_OPTIONS = [
  { title: 'Default', id: undefined },
  { title: 'Balance ascending', id: 'balance-asc' },
  { title: 'Balance descending', id: 'balance-desc' },
  { title: 'Txs count ascending', id: 'txs-asc' },
  { title: 'Txs count descending', id: 'txs-desc' },
];

const VerifiedContractSorting = ({ isActive, sort, setSort }: Props) => {
  const { isOpen, onToggle } = useDisclosure();

  const setSortingFromMenu = React.useCallback((val: string | Array<string>) => {
    const value = val as Sort | Array<Sort>;
    setSort(Array.isArray(value) ? value[0] : value);
  }, [ setSort ]);

  return (
    <Menu>
      <MenuButton>
        <SortButton
          isActive={ isOpen || isActive }
          onClick={ onToggle }
        />
      </MenuButton>
      <MenuList minWidth="240px" zIndex="popover">
        <MenuOptionGroup value={ sort } title="Sort by" type="radio" onChange={ setSortingFromMenu }>
          { SORT_OPTIONS.map((option) => (
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

export default React.memo(chakra(VerifiedContractSorting));
