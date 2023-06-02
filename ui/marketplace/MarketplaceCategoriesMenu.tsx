import { Box, Button, Icon, Menu, MenuButton, MenuList, Skeleton } from '@chakra-ui/react';
import React from 'react';

import { MarketplaceCategory } from 'types/client/marketplace';

import eastMiniArrowIcon from 'icons/arrows/east-mini.svg';

import MarketplaceCategoriesMenuItem from './MarketplaceCategoriesMenuItem';

type Props = {
  categories: Array<string>;
  selectedCategoryId: string;
  onSelect: (category: string) => void;
  isLoading: boolean;
}

const MarketplaceCategoriesMenu = ({ selectedCategoryId, onSelect, categories, isLoading }: Props) => {
  const options = React.useMemo(() => ([
    MarketplaceCategory.FAVORITES,
    MarketplaceCategory.ALL,
    ...categories,
  ]), [ categories ]);

  if (isLoading) {
    return (
      <Skeleton
        h="40px"
        w={{ base: '100%', sm: '120px' }}
        borderRadius="base"
        mb={{ base: 2, sm: 0 }}
        mr={{ base: 0, sm: 2 }}
      />
    );
  }

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
          <MarketplaceCategoriesMenuItem
            key={ category }
            id={ category }
            onClick={ onSelect }
          />
        )) }
      </MenuList>
    </Menu>
  );
};

export default React.memo(MarketplaceCategoriesMenu);
