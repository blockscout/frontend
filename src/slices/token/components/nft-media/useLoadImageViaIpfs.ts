// SPDX-License-Identifier: LicenseRef-Blockscout

import { verifiedFetch } from '@helia/verified-fetch';
import React from 'react';

export default function useLoadImageViaIpfs() {
  const objectUrlRef = React.useRef<string>(undefined);
  const isUnmountedRef = React.useRef(false);

  React.useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
      objectUrlRef.current && URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = undefined;
    };
  }, []);

  return React.useCallback(async(url: string) => {
    const response = await verifiedFetch(url);

    if (response.status !== 200) {
      throw new Error('Failed to load image');
    }

    const blob = await response.blob();
    // Revoked below when replaced and in the unmount cleanup; the rule only follows a URL revoked synchronously in the same function.
    // react-doctor-disable-next-line react-doctor/no-create-object-url-without-revoke
    const src = URL.createObjectURL(blob);

    objectUrlRef.current && URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = src;

    if (isUnmountedRef.current) {
      URL.revokeObjectURL(src);
    }

    return src;
  }, [ ]);
}
