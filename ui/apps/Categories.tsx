import { Box, visuallyHiddenStyle } from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceCategoryNames } from 'types/client/apps';

import useIsMobile from 'lib/hooks/useIsMobile';
import ButtonMenu from 'ui/shared/ButtonMenu';
import useAdaptiveMenu from 'ui/shared/RoutedTabs/useAdaptiveMenu';

import CategoryPrimaryItem from './CategoryPrimaryItem';
import CategorySecondaryItem from './CategorySecondaryItem';
import { APP_CATEGORIES } from './constants';

const categoriesList = Object.keys(APP_CATEGORIES).map((id: string) => ({
  id: id,
  name: APP_CATEGORIES[id as keyof typeof MarketplaceCategoryNames],
}));

type Props = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const Categories = ({ selectedCategory, onCategoryChange }: Props) => {
  const isMobile = useIsMobile();

  const { itemsCut, itemsList, itemsRefs, listRef, isMenuOpen, onMenuOpen, onMenuClose } = useAdaptiveMenu(categoriesList, isMobile);

  const handleClick = React.useCallback((id: string) => {
    onMenuClose();
    onCategoryChange(id);
  }, [ onMenuClose, onCategoryChange ]);

  return (
    <Box
      marginBottom={{ base: 6, lg: 12 }}
      flexWrap="nowrap"
      whiteSpace="nowrap"
      ref={ listRef }
      overflowY="hidden"
      overflowX={{ base: 'auto', lg: undefined }}
      overscrollBehaviorX="contain"
      css={{
        'scroll-snap-type': 'x mandatory',
        // hide scrollbar
        '&::-webkit-scrollbar': { /* Chromiums */
          display: 'none',
        },
        '-ms-overflow-style': 'none', /* IE and Edge */
        'scrollbar-width': 'none', /* Firefox */
      }}
    >
      { itemsList.map((item, index) => {
        if ('id' in item) {
          return (
            <CategoryPrimaryItem
              key={ item.id }
              item={ item }
              selectedCategory={ selectedCategory }
              onCategoryChange={ handleClick }
              ref={ itemsRefs[index] }
              isVisible={ index < itemsCut }
            />
          );
        } else {
          return (
            <ButtonMenu
              isOpen={ isMenuOpen }
              onOpen={ onMenuOpen }
              onClose={ onMenuClose }
              key="menu"
              isTransparent={ itemsCut === 0 }
              styles={ itemsCut < categoriesList.length ?
              // initially our cut is 0 and we don't want to show the menu button too
              // but we want to keep it in the tabs row so it won't collapse
              // that's why we only change opacity but not the position itself
                { opacity: itemsCut === 0 ? 0 : 1 } :
                visuallyHiddenStyle
              }
              buttonRef={ itemsRefs[index] }
            >
              { categoriesList.slice(itemsCut).map((menuItem) => (
                <CategorySecondaryItem
                  key={ menuItem.id }
                  item={ menuItem }
                  selectedCategory={ selectedCategory }
                  onCategoryChange={ handleClick }
                  ref={ itemsRefs[index] }
                />
              )) }
            </ButtonMenu>
          );
        }
      }) }
    </Box>
  );
};

export default Categories;
