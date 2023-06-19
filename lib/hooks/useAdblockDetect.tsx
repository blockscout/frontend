import { useEffect } from 'react';

import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import isBrowser from 'lib/isBrowser';

export default function useAdblockDetect() {
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  useEffect(() => {
    if (isBrowser() && !hasAdblockCookie) {
      const url = 'https://request-global.czilladx.com';
      fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
      }).catch(() => {
        cookies.set(cookies.NAMES.ADBLOCK_DETECTED, 'true', { expires: 1 });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
