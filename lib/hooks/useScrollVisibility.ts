import clamp from 'lodash/clamp';
import throttle from 'lodash/throttle';
import React from 'react';

import isBrowser from 'lib/isBrowser';

const SCROLL_DIFF_THRESHOLD = 20;

export default function useScrollVisibility(direction: 'up' | 'down') {
  const prevScrollPosition = React.useRef(isBrowser() ? window.pageYOffset : 0);
  const [ isVisible, setVisibility ] = React.useState(true);

  const handleScroll = React.useCallback(() => {
    const currentScrollPosition = clamp(window.pageYOffset, 0, window.document.body.scrollHeight - window.innerHeight);
    const scrollDiff = currentScrollPosition - prevScrollPosition.current;

    if (Math.abs(scrollDiff) > SCROLL_DIFF_THRESHOLD) {
      setVisibility(direction === 'up' ? scrollDiff < 0 : scrollDiff > 0);
    }

    prevScrollPosition.current = currentScrollPosition;
  }, [ direction ]);

  React.useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 300);

    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  // replicate componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isVisible;
}
