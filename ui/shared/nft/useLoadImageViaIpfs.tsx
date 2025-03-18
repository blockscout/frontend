import { verifiedFetch } from '@helia/verified-fetch';
import React from 'react';

export default function useLoadImageViaIpfs() {
  const controller = React.useRef<AbortController | null>(null);

  // TODO @tom2drum fix aborting the request
  //   React.useEffect(() => {
  //     return () => {
  //       controller.current?.abort();
  //     };
  //   }, []);

  return React.useCallback(async(src: string) => {
    try {
      controller.current = new AbortController();

      const response = await verifiedFetch(src, { signal: controller.current.signal });

      if (response.status === 200) {
        const blob = await response.blob();
        const src = URL.createObjectURL(blob);
        return src;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('__>__', { error });
      throw error;
    }
  }, [ ]);
}
