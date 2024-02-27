import React from 'react';

interface Props {
  activeTabIndex: number;
  tabsRefs: Array<React.RefObject<HTMLButtonElement>>;
  listRef: React.RefObject<HTMLDivElement>;
  isMobile?: boolean;
}

export default function useScrollToActiveTab({ activeTabIndex, tabsRefs, listRef, isMobile }: Props) {
  React.useEffect(() => {
    if (activeTabIndex < tabsRefs.length && isMobile) {
      window.setTimeout(() => {
        const activeTabRef = tabsRefs[activeTabIndex];

        if (activeTabRef.current && listRef.current) {
          const activeTabRect = activeTabRef.current.getBoundingClientRect();

          listRef.current.scrollTo({
            left: activeTabRect.left + listRef.current.scrollLeft - 16,
            behavior: 'smooth',
          });
        }

      // have to wait until DOM is updated and all styles to tabs is applied
      }, 300);
    }
  // run only when tab index or device type is changed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ activeTabIndex, isMobile ]);
}
