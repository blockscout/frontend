import _clamp from 'lodash/clamp';
import React from 'react';

const MAX_DELAY = 500;
const MIN_DELAY = 50;

export default function useGradualIncrement(initialValue: number): [number, (inc: number) => void] {
  const [ num, setNum ] = React.useState(initialValue);
  const queue = React.useRef<number>(0);
  const timeoutId = React.useRef(0);

  const incrementDelayed = React.useCallback(() => {
    if (queue.current === 0) {
      return;
    }

    queue.current--;
    setNum(prev => prev + 1);
    timeoutId.current = 0;
  }, []);

  const increment = React.useCallback((inc: number) => {
    if (inc < 1) {
      return;
    }

    queue.current += inc;

    if (!timeoutId.current) {
      timeoutId.current = window.setTimeout(incrementDelayed, 0);
    }
  }, [ incrementDelayed ]);

  React.useEffect(() => {
    if (queue.current > 0 && !timeoutId.current) {
      const delay = _clamp(MAX_DELAY / queue.current * 1.5, MIN_DELAY, MAX_DELAY);
      timeoutId.current = window.setTimeout(incrementDelayed, delay);
    }
  }, [ incrementDelayed, num ]);

  React.useEffect(() => {
    return () => {
      window.clearTimeout(timeoutId.current);
    };
  }, []);

  return [ num, increment ];
}
