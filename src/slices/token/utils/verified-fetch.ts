// SPDX-License-Identifier: LicenseRef-Blockscout

// Recursive trustless gateways from independent operators, so one outage does not break IPFS loading.
// Both must answer `?format=raw` block requests with CORS headers and without redirecting to another host,
// since every host the client reaches has to be allowed in the CSP connect-src.
export const VERIFIED_FETCH_GATEWAYS = [
  'https://trustless-gateway.link',
  'https://ipfs.filebase.io',
];
