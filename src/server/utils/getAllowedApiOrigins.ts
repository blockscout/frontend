// SPDX-License-Identifier: LicenseRef-Blockscout

import essentialDappsChains from 'src/features/marketplace/chains-config/essential-dapps';
import multichainConfig from 'src/features/multichain/chains-config';

import config from 'src/config';

// Collects the set of origins (scheme + host + port) that the Next.js proxy
// (src/pages/api/proxy.ts) is allowed to forward requests to.
//
// The proxy picks its target host from the user-controlled "x-endpoint" header,
// which would otherwise allow server-side request forgery (CWE-918). To prevent
// that, the resolved request origin is checked against this allow-list, which is
// derived solely from server-side configuration:
//   - the local instance API endpoints (config.apis)
//   - every chain endpoint in the multichain cluster config
//   - every chain core endpoint in the essential dapps config
function toOrigin(endpoint: string | undefined): string | undefined {
  if (!endpoint) {
    return;
  }

  try {
    return new URL(endpoint).origin;
  } catch (error) {
    return;
  }
}

function collectApiEndpoints(apis: Record<string, { endpoint?: string } | undefined> | undefined): Array<string> {
  if (!apis) {
    return [];
  }

  return Object.values(apis)
    .map((api) => api?.endpoint)
    .filter((endpoint): endpoint is string => Boolean(endpoint));
}

let cache: Set<string> | undefined;

export default function getAllowedApiOrigins(): Set<string> {
  if (cache) {
    return cache;
  }

  const endpoints: Array<string> = [
    ...collectApiEndpoints(config.apis),
    ...(multichainConfig()?.chains ?? []).flatMap((chain) => collectApiEndpoints(chain.app_config?.apis)),
    ...(essentialDappsChains()?.chains ?? []).flatMap((chain) => collectApiEndpoints(chain.app_config?.apis)),
  ];

  cache = new Set(endpoints.map(toOrigin).filter((origin): origin is string => Boolean(origin)));

  return cache;
}
