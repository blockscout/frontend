import { Button, Tab, TabList, TabPanel, TabPanels, Tabs, visuallyHiddenStyle } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from './types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { link } from 'lib/link/link';

import ButtonMenu from '../ButtonMenu';
import useAdaptiveMenu from './useAdaptiveMenu';

interface Props {
  tabs: Array<RoutedTab>;
  defaultActiveTab: RoutedTab['routeName'];
}

const RoutedTabs = ({ tabs, defaultActiveTab }: Props) => {
  const defaultIndex = tabs.findIndex(({ routeName }) => routeName === defaultActiveTab);

  const [ activeTab ] = React.useState<number>(defaultIndex);

  const router = useRouter();
  const isMobile = useIsMobile();
  const {
    itemsCut,
    itemsList,
    itemsRefs,
    listRef,
    isMenuOpen,
    onMenuOpen,
    onMenuClose,
  } = useAdaptiveMenu(tabs, isMobile);

  const handleTabChange = React.useCallback((index: number) => {
    const nextTab = tabs[index];

    if (nextTab.routeName) {
      const newUrl = link(nextTab.routeName, router.query);
      router.push(newUrl, undefined, { shallow: true });
    }
  }, [ tabs, router ]);

  const handleMenuItemClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    onMenuClose();
    const tabIndex = (event.target as HTMLButtonElement).getAttribute('data-index');
    if (tabIndex) {
      handleTabChange(itemsCut + Number(tabIndex));
    }
  }, [ onMenuClose, handleTabChange, itemsCut ]);

  return (
    <Tabs variant="soft-rounded" colorScheme="blue" isLazy onChange={ handleTabChange } index={ activeTab }>
      <TabList
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
        { itemsList.map((tab, index) => {
          if (!tab.routeName) {
            return (
              <ButtonMenu
                isOpen={ isMenuOpen }
                onOpen={ onMenuOpen }
                onClose={ onMenuClose }
                key="menu"
                isActive={ activeTab >= itemsCut }
                isTransparent={ itemsCut === 0 }
                styles={ itemsCut < tabs.length ?
                // initially our cut is 0 and we don't want to show the menu button too
                // but we want to keep it in the tabs row so it won't collapse
                // that's why we only change opacity but not the position itself
                  { opacity: itemsCut === 0 ? 0 : 1 } :
                  visuallyHiddenStyle
                }
                buttonRef={ itemsRefs[index] }
              >
                { tabs.slice(itemsCut).map((tab, index) => (
                  <Button
                    key={ tab.routeName }
                    variant="ghost"
                    onClick={ handleMenuItemClick }
                    isActive={ tabs[activeTab].routeName === tab.routeName }
                    justifyContent="left"
                    data-index={ index }
                  >
                    { tab.title }
                  </Button>
                )) }
              </ButtonMenu>
            );
          }

          return (
            <Tab
              key={ tab.routeName }
              ref={ itemsRefs[index] }
              scrollSnapAlign="start"
              { ...(index < itemsCut ? {} : { css: { ...visuallyHiddenStyle } }) }
            >
              { tab.title }
            </Tab>
          );
        }) }
      </TabList>
      <TabPanels>
        { itemsList.map((tab) => <TabPanel padding={ 0 } key={ tab.routeName }>{ tab.component }</TabPanel>) }
      </TabPanels>
    </Tabs>
  );
};

export default React.memo(RoutedTabs);
