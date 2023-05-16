import _debounce from 'lodash/debounce';
import React from 'react';

import type { RoutedTab } from './types';

import { menuButton } from './utils';

export default function useAdaptiveTabs(tabs: Array<RoutedTab>, disabled?: boolean) {
  // to avoid flickering we set initial value to 0
  // so there will be no displayed tabs initially
  const [ tabsCut, setTabsCut ] = React.useState(disabled ? tabs.length : 0);
  const [ tabsRefs, setTabsRefs ] = React.useState<Array<React.RefObject<HTMLButtonElement>>>([]);
  const listRef = React.useRef<HTMLDivElement>(null);
  const rightSlotRef = React.useRef<HTMLDivElement>(null);

  const calculateCut = React.useCallback(() => {
    const listWidth = listRef.current?.getBoundingClientRect().width;
    const rightSlotWidth = rightSlotRef.current?.getBoundingClientRect().width || 0;
    const tabWidths = tabsRefs.map((tab) => tab.current?.getBoundingClientRect().width);
    const menuWidth = tabWidths[tabWidths.length - 1];

    if (!listWidth || !menuWidth) {
      return tabs.length;
    }

    const { visibleNum } = tabWidths.slice(0, -1).reduce((result, item, index) => {
      if (!item) {
        return result;
      }

      if (result.accWidth + item <= listWidth - rightSlotWidth - menuWidth) {
        return { visibleNum: result.visibleNum + 1, accWidth: result.accWidth + item };
      }

      if (result.accWidth + item <= listWidth - rightSlotWidth && index === tabWidths.length - 2) {
        return { visibleNum: result.visibleNum + 1, accWidth: result.accWidth + item };
      }

      return result;
    }, { visibleNum: 0, accWidth: 0 });

    return visibleNum;
  }, [ tabs.length, tabsRefs ]);

  const tabsList = React.useMemo(() => {
    if (disabled) {
      return tabs;
    }

    return [ ...tabs, menuButton ];
  }, [ tabs, disabled ]);

  React.useEffect(() => {
    setTabsRefs(tabsList.map((_, index) => tabsRefs[index] || React.createRef()));
    setTabsCut(disabled ? tabs.length : 0);
  // update refs only when disabled prop changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ disabled ]);

  React.useEffect(() => {
    if (tabsRefs.length > 0 && !disabled) {
      setTabsCut(calculateCut());
    }
  }, [ calculateCut, disabled, tabsRefs ]);

  React.useEffect(() => {
    if (tabsRefs.length === 0 || disabled) {
      return;
    }

    const resizeHandler = _debounce(() => {
      setTabsCut(calculateCut());
    }, 100);
    const resizeObserver = new ResizeObserver(resizeHandler);

    resizeObserver.observe(document.body);
    return function cleanup() {
      resizeObserver.unobserve(document.body);
    };
  }, [ calculateCut, disabled, tabsRefs.length ]);

  return React.useMemo(() => {
    return {
      tabsCut,
      tabsList,
      tabsRefs,
      listRef,
      rightSlotRef,
    };
  }, [ tabsList, tabsCut, tabsRefs, listRef ]);
}
