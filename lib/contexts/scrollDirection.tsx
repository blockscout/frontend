import { throttle, clamp } from 'es-toolkit';
import React from 'react';

const ScrollDirectionContext = React.createContext<'up' | 'down' | null>(null);
import { isBrowser } from 'toolkit/utils/isBrowser';

const SCROLL_DIFF_THRESHOLD = 20;

type Directions = 'up' | 'down';

interface Props {
  children: React.ReactNode;
}

export function ScrollDirectionProvider({ children }: Props) {
  const prevScrollPosition = React.useRef(isBrowser() ? window.pageYOffset : 0);
  const [ scrollDirection, setDirection ] = React.useState<Directions | null>(null);

  const handleScroll = React.useCallback(() => {
    const currentScrollPosition = clamp(window.pageYOffset, 0, window.document.body.scrollHeight - window.innerHeight);
    const scrollDiff = currentScrollPosition - prevScrollPosition.current;

    if (window.pageYOffset === 0) {
      setDirection(null);
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

  return (
    <ScrollDirectionContext.Provider value={ scrollDirection }>
      { children }
    </ScrollDirectionContext.Provider>
  );
}

export function useScrollDirection() {
  const context = React.useContext(ScrollDirectionContext);
  if (context === undefined) {
    throw new Error('useScrollDirection must be used within a ScrollDirectionProvider');
  }
  return context;
}
