import clamp from 'lodash/clamp';
import throttle from 'lodash/throttle';
import React from 'react';

import isBrowser from 'lib/isBrowser';

const SCROLL_DIFF_THRESHOLD = 20;

type Directions = 'up' | 'down';

export default function useScrollDirection() {
  const prevScrollPosition = React.useRef(isBrowser() ? window.pageYOffset : 0);
  const [ scrollDirection, setDirection ] = React.useState<Directions>();

  const handleScroll = React.useCallback(() => {
    const currentScrollPosition = clamp(window.pageYOffset, 0, window.document.body.scrollHeight - window.innerHeight);
    const scrollDiff = currentScrollPosition - prevScrollPosition.current;

    if (window.pageYOffset === 0) {
      setDirection(undefined);
    } else if (Math.abs(scrollDiff) > SCROLL_DIFF_THRESHOLD) {
      setDirection(scrollDiff < 0 ? 'up' : 'down');
    }

    prevScrollPosition.current = currentScrollPosition;
  }, [ ]);

  React.useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 300);

    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  // replicate componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return scrollDirection;
}
