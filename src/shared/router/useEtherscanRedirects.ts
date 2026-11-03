// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import getQueryParamString from './get-query-param-string';
import type { Route } from './routes';
import type { Router } from './useRouter';
import { useRouter } from './useRouter';

type TabRedirectPathname = '/tx/[hash]' | '/address/[hash]' | '/token/[hash]';

const TAB_REDIRECTS: Record<TabRedirectPathname, Record<string, string | undefined>> = {
  '/tx/[hash]': {
    '#statechange': 'state',
    '#eventlog': 'logs',
    '#aa': 'user_ops',
    '#internal': 'internal',
  },
  '/address/[hash]': {
    '#internaltx': 'internal_txns',
    '#tokentxns': 'token_transfers',
    '#asset-tokens': 'tokens',
    '#asset-nfts': 'tokens_nfts',
    '#aatx': 'user_ops',
    '#code': 'contract',
    '#readContract': 'read_contract',
    '#writeContract': 'write_contract',
  },
  '/token/[hash]': {
    '#balances': 'holders',
  },
};

const isTabRedirectPathname = (pathname: Route['pathname']): pathname is TabRedirectPathname => pathname in TAB_REDIRECTS;

export function getEtherscanRedirect(router: Router, segmentHash: string): Route | undefined {
  if (router.pathname === '/stats') {
    return segmentHash === '#section-contracts-data' ? { pathname: '/stats', hash: 'contracts' } : undefined;
  }

  if (!isTabRedirectPathname(router.pathname)) {
    return undefined;
  }

  const tab = TAB_REDIRECTS[router.pathname][segmentHash];
  if (!tab) {
    return undefined;
  }

  return { pathname: router.pathname, query: { hash: getQueryParamString(router.query.hash), tab } };
}

export default function useEtherscanRedirects() {
  const router = useRouter();

  // The browser does not send the segment hash (or anchor) to the server,
  // so we have to handle such redirects for the etherscan-like links on the client side.
  React.useEffect(() => {
    const target = window.location.hash ? getEtherscanRedirect(router, window.location.hash) : undefined;

    if (target) {
      router.replace(target);
    }
  // run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);
}
