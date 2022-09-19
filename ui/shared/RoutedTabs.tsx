import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
} from '@chakra-ui/react';
import type { StyleProps } from '@chakra-ui/styled-system';
import _debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import React from 'react';

import { middot } from 'lib/html-entities';
import { link } from 'lib/link/link';
import type { RouteName } from 'lib/link/routes';

export interface RoutedTab {
  // for simplicity we use routeName as an id
  // if we migrate to non-Next.js router that should be revised
  // id: string;
  routeName: RouteName | null;
  title: string;
  component: React.ReactNode;
}

const menuButton: RoutedTab = {
  routeName: null,
  title: `${ middot }${ middot }${ middot }`,
  component: null,
};

const hiddenItemStyles: StyleProps = {
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  visibility: 'hidden',
};

interface Props {
  tabs: Array<RoutedTab>;
  defaultActiveTab: RoutedTab['routeName'];
}

const RoutedTabs = ({ tabs, defaultActiveTab }: Props) => {
  const defaultIndex = tabs.findIndex(({ routeName }) => routeName === defaultActiveTab);

  const [ tabsNum, setTabsNum ] = React.useState(tabs.length);
  const [ activeTab, setActiveTab ] = React.useState<number>(defaultIndex);
  const { isOpen: isMenuOpen, onToggle: onMenuToggle } = useDisclosure();
  const [ tabsRefs, setTabsRefs ] = React.useState<Array<React.RefObject<HTMLButtonElement>>>([]);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const router = useRouter();

  const displayedTabs = (() => {
    return [ ...tabs, menuButton ];
  })();

  React.useEffect(() => {
    setTabsRefs(displayedTabs.map((_, index) => tabsRefs[index] || React.createRef()));
  // imitate componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateCut = React.useCallback(() => {
    const listWidth = menuRef.current?.getBoundingClientRect().width;
    const tabWidths = tabsRefs.map((tab) => tab.current?.getBoundingClientRect().width);
    const menuWidth = tabWidths.at(-1);

    if (!listWidth || !menuWidth) {
      return tabs.length;
    }

    const { visibleTabNum } = tabWidths.slice(0, -1).reduce((result, item, index) => {
      if (!item) {
        return result;
      }

      if (result.accWidth + item <= listWidth - menuWidth) {
        return { visibleTabNum: result.visibleTabNum + 1, accWidth: result.accWidth + item };
      }

      if (result.accWidth + item <= listWidth && index === tabWidths.length - 2) {
        return { visibleTabNum: result.visibleTabNum + 1, accWidth: result.accWidth + item };
      }

      return result;
    }, { visibleTabNum: 0, accWidth: 0 });

    return visibleTabNum;
  }, [ tabs.length, tabsRefs ]);

  React.useEffect(() => {
    if (tabsRefs.length > 0) {
      setTabsNum(calculateCut());
    }
  }, [ calculateCut, tabsRefs ]);

  React.useEffect(() => {
    const resizeHandler = _debounce(() => {
      setTabsNum(calculateCut());
    }, 100);
    const resizeObserver = new ResizeObserver(resizeHandler);

    resizeObserver.observe(document.body);
    return function cleanup() {
      resizeObserver.unobserve(document.body);
    };
  }, [ calculateCut ]);

  const handleTabChange = React.useCallback((index: number) => {
    const nextTab = displayedTabs[index];

    if (nextTab.routeName) {
      const newUrl = link(nextTab.routeName, router.query);
      router.push(newUrl, undefined, { shallow: true });
    }

    setActiveTab(index);
  }, [ displayedTabs, router ]);

  const handleItemInMenuClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const tabIndex = (event.target as HTMLButtonElement).getAttribute('data-index');

    if (tabIndex) {
      handleTabChange(tabsNum + Number(tabIndex));
    }
  }, [ handleTabChange, tabsNum ]);

  return (
    <Tabs variant="soft-rounded" colorScheme="blue" isLazy onChange={ handleTabChange } index={ activeTab }>
      <TabList marginBottom={{ base: 6, lg: 8 }} flexWrap="nowrap" whiteSpace="nowrap" ref={ menuRef }>
        { displayedTabs.map((tab, index) => {
          if (!tab.routeName) {
            return (
              <Popover isLazy placement="bottom-end" key="more">
                <PopoverTrigger>
                  <Button
                    variant="subtle"
                    onClick={ onMenuToggle }
                    isActive={ isMenuOpen || activeTab >= tabsNum }
                    ref={ tabsRefs[index] }
                    { ...(tabsNum < tabs.length ? {} : hiddenItemStyles) }
                  >
                    { menuButton.title }
                  </Button>
                </PopoverTrigger>
                <PopoverContent w="auto">
                  <PopoverBody display="flex" flexDir="column">
                    { displayedTabs.slice(tabsNum, -1).map((tab, index) => (
                      <Button
                        key={ tab.routeName }
                        variant="subtle"
                        onClick={ handleItemInMenuClick }
                        isActive={ displayedTabs[activeTab].routeName === tab.routeName }
                        justifyContent="left"
                        data-index={ index }
                      >
                        { tab.title }
                      </Button>
                    )) }
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            );
          }

          return (
            <Tab
              key={ tab.routeName }
              ref={ tabsRefs[index] }
              { ...(index < tabsNum ? {} : hiddenItemStyles) }
            >
              { tab.title }
            </Tab>
          );
        }) }
      </TabList>
      <TabPanels>
        { displayedTabs.map((tab) => <TabPanel padding={ 0 } key={ tab.routeName }>{ tab.component }</TabPanel>) }
      </TabPanels>
    </Tabs>
  );
};

export default React.memo(RoutedTabs);
