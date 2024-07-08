import { Box, Button, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, chakra } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import Menu from 'ui/shared/chakra/Menu';
import IconSvg from 'ui/shared/IconSvg';

type Props<T extends string> = {
  items: Array<{id: T; title: string}>;
  selectedId: T;
  onSelect: (id: T) => void;
}

export function StatsDropdownMenu<T extends string>({ items, selectedId, onSelect }: Props<T>) {
  const selectedCategory = items.find(category => category.id === selectedId);

  const handleSelection = useCallback((id: string | Array<string>) => {
    const selectedId = Array.isArray(id) ? id[0] : id;
    onSelect(selectedId as T);
  }, [ onSelect ]);

  return (
    <Menu
    >
      <MenuButton
        as={ Button }
        size="md"
        variant="outline"
        colorScheme="gray"
        w="100%"
      >
        <Box
          as="span"
          display="flex"
          alignItems="center"
        >
          <chakra.span
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            { selectedCategory?.title }
          </chakra.span>
          <IconSvg transform="rotate(-90deg)" ml="auto" name="arrows/east-mini" w={ 5 } h={ 5 }/>
        </Box>
      </MenuButton>

      <MenuList zIndex={ 3 }>
        <MenuOptionGroup
          value={ selectedId }
          type="radio"
          onChange={ handleSelection }
        >
          { items.map((item) => (
            <MenuItemOption
              key={ item.id }
              value={ item.id }
            >
              { item.title }
            </MenuItemOption>
          )) }
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}

export default StatsDropdownMenu;
