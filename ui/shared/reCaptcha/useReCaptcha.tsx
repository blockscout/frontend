import React from 'react';
import type ReCAPTCHA from 'react-google-recaptcha';

export default function useReCaptcha() {
  const ref = React.useRef<ReCAPTCHA>(null);
  const rejectCb = React.useRef<((error: Error) => void) | null>(null);

  const [ isOpen, setIsOpen ] = React.useState(false);
  const [ isInitError, setIsInitError ] = React.useState(false);

  const executeAsync: () => Promise<string | null> = React.useCallback(async() => {
    setIsOpen(true);
    const tokenPromise = ref.current?.executeAsync() || Promise.reject(new Error('Unable to execute ReCaptcha'));
    const modalOpenPromise = new Promise<null>((resolve, reject) => {
      rejectCb.current = reject;
    });

    return Promise.race([ tokenPromise, modalOpenPromise ]);
  }, [ ref ]);

  const handleContainerClick = React.useCallback(() => {
    setIsOpen(false);
    rejectCb.current?.(new Error('ReCaptcha is not solved'));
  }, []);

  const handleInitError = React.useCallback(() => {
    setIsInitError(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const container = window.document.querySelector('div:has(div):has(iframe[title="recaptcha challenge expires in two minutes"])');
    container?.addEventListener('click', handleContainerClick);

    return () => {
      container?.removeEventListener('click', handleContainerClick);
    };
  }, [ isOpen, handleContainerClick ]);

  return React.useMemo(() => ({ ref, executeAsync, isInitError, onInitError: handleInitError }), [ ref, executeAsync, isInitError, handleInitError ]);
}
