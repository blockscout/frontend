import { useDisclosure } from '@chakra-ui/react';
import _debounce from 'lodash/debounce';
import React from 'react';

import { menuButton } from './utils';

export default function useAdaptiveMenu<T>(items: Array<T>, disabled?: boolean) {
  // to avoid flickering we set initial value to 0
  // so there will be no displayed items initially
  const [ itemsCut, setItemsCut ] = React.useState(disabled ? items.length : 0);
  const [ itemsRefs, setItemsRefs ] = React.useState<Array<React.RefObject<HTMLButtonElement>>>([]);
  const listRef = React.useRef<HTMLDivElement>(null);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const calculateCut = React.useCallback(() => {
    const listWidth = listRef.current?.getBoundingClientRect().width;
    const tabWidths = itemsRefs.map((tab) => tab.current?.getBoundingClientRect().width);
    const menuWidth = tabWidths.at(-1);

    if (!listWidth || !menuWidth) {
      return items.length;
    }

    const { visibleNum } = tabWidths.slice(0, -1).reduce((result, item, index) => {
      if (!item) {
        return result;
      }

      if (result.accWidth + item <= listWidth - menuWidth) {
        return { visibleNum: result.visibleNum + 1, accWidth: result.accWidth + item };
      }

      if (result.accWidth + item <= listWidth && index === tabWidths.length - 2) {
        return { visibleNum: result.visibleNum + 1, accWidth: result.accWidth + item };
      }

      return result;
    }, { visibleNum: 0, accWidth: 0 });

    return visibleNum;
  }, [ items.length, itemsRefs ]);

  const itemsList = React.useMemo(() => {
    if (disabled) {
      return items;
    }

    return [ ...items, menuButton ];
  }, [ items, disabled ]);

  React.useEffect(() => {
    setItemsRefs(disabled ? [] : itemsList.map((_, index) => itemsRefs[index] || React.createRef()));
    // update refs only when disabled prop changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ disabled ]);

  React.useEffect(() => {
    if (itemsRefs.length > 0) {
      setItemsCut(calculateCut());
    }
  }, [ calculateCut, itemsRefs ]);

  React.useEffect(() => {
    if (itemsRefs.length === 0) {
      return;
    }

    const resizeHandler = _debounce(() => {
      setItemsCut(calculateCut());
    }, 100);
    const resizeObserver = new ResizeObserver(resizeHandler);

    resizeObserver.observe(document.body);
    return function cleanup() {
      resizeObserver.unobserve(document.body);
    };
  }, [ calculateCut, itemsRefs.length ]);

  return React.useMemo(() => {
    return {
      itemsCut,
      itemsList,
      itemsRefs,
      listRef,
      isMenuOpen: isOpen,
      onMenuOpen: onOpen,
      onMenuClose: onClose,
    };
  }, [ itemsCut, itemsList, itemsRefs, isOpen, onOpen, onClose ]);
}
