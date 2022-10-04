import { Box, Button, visuallyHiddenStyle } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import useAdaptiveTabs from 'ui/shared/RoutedTabs/useAdaptiveTabs';

import { APP_CATEGORIES } from './constants';

const Categories = () => {
  const isMobile = useIsMobile();
  const categoriesList = Object.keys(APP_CATEGORIES).map((key) => ({
    id: key,
    name: APP_CATEGORIES[key],
  }));

  const { tabsCut, tabsList, tabsRefs, listRef } = useAdaptiveTabs(categoriesList, isMobile);

  return (
    <Box
      ref={ listRef }
      marginBottom={{ base: 6, lg: 12 }}
      flexWrap="nowrap"
      whiteSpace="nowrap"
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
      { tabsList.map((item, index) => {

        return (
          <Button
            key={ item.id }
            ref={ tabsRefs[index] }
            { ...(index < tabsCut ? {} : visuallyHiddenStyle) }
            scrollSnapAlign="start"
          >
            { item.name }
          </Button>
        );
      }) }
    </Box>
  );
};

export default Categories;
