import { Box, Button, Icon, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import React from 'react';

import { AppCategory } from 'types/client/apps';

import eastMiniArrowIcon from 'icons/arrows/east-mini.svg';

import CategoriesMenuItem from './CategoriesMenuItem';

type Props = {
  categories: Array<string>;
  selectedCategoryId: string;
  onSelect: (category: string) => void;
}

const CategoriesMenu = ({ selectedCategoryId, onSelect, categories }: Props) => {
  const options = React.useMemo(() => ([
    AppCategory.FAVORITES,
    AppCategory.ALL,
    ...categories,
  ]), [ categories ]);

  return (
    <Menu>
      <MenuButton
        as={ Button }
        mb={{ base: 2, sm: 0 }}
        mr={{ base: 0, sm: 2 }}
        size="md"
        variant="outline"
        colorScheme="gray"
        flexShrink={ 0 }
      >
        <Box
          as="span"
          display="flex"
          alignItems="center"
        >
          { selectedCategoryId }
          <Icon transform="rotate(-90deg)" ml={{ base: 'auto', sm: 1 }} as={ eastMiniArrowIcon } w={ 5 } h={ 5 }/>
        </Box>
      </MenuButton>

      <MenuList zIndex={ 3 }>
        { options.map((category: string) => (
          <CategoriesMenuItem
            key={ category }
            id={ category }
            onClick={ onSelect }
          />
        )) }
      </MenuList>
    </Menu>
  );
};

export default React.memo(CategoriesMenu);
