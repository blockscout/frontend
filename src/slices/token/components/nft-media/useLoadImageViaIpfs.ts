// SPDX-License-Identifier: LicenseRef-Blockscout

import { withHTTP } from '@helia/http';
import type { VerifiedFetch } from '@helia/verified-fetch';
import { createVerifiedFetchWithHelia } from '@helia/verified-fetch';
import { createHeliaLight } from 'helia';
import React from 'react';

import { VERIFIED_FETCH_GATEWAYS } from 'src/slices/token/utils/verified-fetch';

import { SECOND } from 'src/toolkit/utils/consts';

// a block the gateways have to look up first can stall for minutes; past this the image falls back to HTTP
const LOAD_TIMEOUT = 30 * SECOND;

const EMPTY_ROUTER = {
  name: 'empty-router',
  async *findProviders() {},
};

let verifiedFetchPromise: Promise<VerifiedFetch> | undefined;

// The default verified-fetch node discovers providers through delegated routing and connects to them directly,
// but those hosts are unknown in advance and cannot be allowed by the CSP, so only the fixed gateways are used.
function getVerifiedFetch(): Promise<VerifiedFetch> {
  verifiedFetchPromise ??= (async() => {
    const helia = withHTTP(createHeliaLight(), {
      delegatedRouters: [],
      recursiveGateways: VERIFIED_FETCH_GATEWAYS,
    });
    // Helia waits forever for providers when it has no regular router, and never falls back to the gateways
    helia.addRouter(EMPTY_ROUTER);
    await helia.start();
    return createVerifiedFetchWithHelia(helia);
  })().catch((error: unknown) => {
    verifiedFetchPromise = undefined;
    throw error;
  });

  return verifiedFetchPromise;
}

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

    const verifiedFetch = await getVerifiedFetch();
    const response = await verifiedFetch(url, { signal: AbortSignal.timeout(LOAD_TIMEOUT) });

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
