// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

export function posthog(isPrivateMode: boolean): CspDev.DirectiveDescriptor {
  if (!config.services.posthog.apiKey || isPrivateMode) {
    return {};
  }

  // a wildcard per PostHog's CSP guidance: lazy-loaded bundles come from a separate assets subdomain
  return {
    'script-src': [ '*.posthog.com' ],
    'connect-src': [ '*.posthog.com' ],
    'img-src': [ '*.posthog.com' ],
  };
}
