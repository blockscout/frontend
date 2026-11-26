// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

type PolicyDirective = 'script-src' | 'connect-src' | 'img-src';

// The host options of posthog-js - https://posthog.com/docs/libraries/js/config
const HOST_OPTION_DIRECTIVES: ReadonlyArray<readonly [ string, ReadonlyArray<PolicyDirective> ]> = [
  [ 'api_host', [ 'script-src', 'connect-src', 'img-src' ] ],
  [ 'asset_host', [ 'script-src' ] ],
  [ 'flags_api_host', [ 'connect-src' ] ],
];

function getCustomOrigin(host: unknown): string | undefined {
  if (typeof host !== 'string' || !URL.canParse(host)) {
    return;
  }

  const url = new URL(host);
  const isWebUrl = url.protocol === 'https:' || url.protocol === 'http:';
  const isPosthogCloud = url.hostname === 'posthog.com' || url.hostname.endsWith('.posthog.com');

  return isWebUrl && !isPosthogCloud ? url.origin : undefined;
}

export function posthog(isPrivateMode: boolean): CspDev.DirectiveDescriptor {
  const { apiKey, configOverrides } = config.services.posthog;

  if (!apiKey || isPrivateMode) {
    return {};
  }

  // a wildcard per PostHog's CSP guidance: lazy-loaded bundles come from a separate assets subdomain
  const policy: Record<PolicyDirective, Array<string>> = {
    'script-src': [ '*.posthog.com' ],
    'connect-src': [ '*.posthog.com' ],
    'img-src': [ '*.posthog.com' ],
  };

  for (const [ option, directives ] of HOST_OPTION_DIRECTIVES) {
    const origin = getCustomOrigin(configOverrides?.[option]);
    if (!origin) {
      continue;
    }

    for (const directive of directives) {
      policy[directive].push(origin);
    }
  }

  return policy;
}
