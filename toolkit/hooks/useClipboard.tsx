import { useCopyToClipboard } from '@uidotdev/usehooks';
import React from 'react';

export default function useClipboard(text: string, timeout?: number) {
  const timeoutRef = React.useRef<number | null>(null);
  const [ hasCopied, setHasCopied ] = React.useState(false);
  const [ , copyToClipboard ] = useCopyToClipboard();

  const copy = React.useCallback(() => {
    copyToClipboard(text);
    setHasCopied(true);
    timeoutRef.current = window.setTimeout(() => {
      setHasCopied(false);
    }, timeout);
  }, [ text, copyToClipboard, timeout ]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return React.useMemo(() => {
    return {
      hasCopied,
      copy,
    };
  }, [ hasCopied, copy ]);
}
