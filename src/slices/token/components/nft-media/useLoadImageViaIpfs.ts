// SPDX-License-Identifier: LicenseRef-Blockscout

import { verifiedFetch } from '@helia/verified-fetch';
import React from 'react';

export default function useLoadImageViaIpfs() {
  const objectUrlRef = React.useRef<string>(undefined);
  const generationRef = React.useRef(0);

  React.useEffect(() => {
    return () => {
      generationRef.current += 1;
      objectUrlRef.current && URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = undefined;
    };
  }, []);

  return React.useCallback(async(url: string): Promise<string | undefined> => {
    generationRef.current += 1;
    const generation = generationRef.current;

    const response = await verifiedFetch(url);

    if (response.status !== 200) {
      throw new Error('Failed to load image');
    }

    const blob = await response.blob();
    // react-doctor-disable-next-line react-doctor/no-create-object-url-without-revoke -- revoked when superseded, stale or unmounted; rule wants a sync revoke
    const src = URL.createObjectURL(blob);

    if (generation !== generationRef.current) {
      URL.revokeObjectURL(src);
      return undefined;
    }

    objectUrlRef.current && URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = src;

    return src;
  }, [ ]);
}
