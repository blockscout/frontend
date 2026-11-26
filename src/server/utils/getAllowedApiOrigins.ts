// SPDX-License-Identifier: LicenseRef-Blockscout

import essentialDappsChains from 'src/features/marketplace/chains-config/essential-dapps';
import multichainConfig from 'src/features/multichain/chains-config';

import config from 'src/config';

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

// The proxy takes its target from the user-controlled "x-endpoint" header, so this allow-list against
// server-side request forgery (CWE-918) is derived solely from server-side configuration.
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
