// SPDX-License-Identifier: LicenseRef-Blockscout

import { pickBy } from 'es-toolkit';

import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import * as cookies from 'src/shared/storage/cookies';

import type { ResourceName } from '../resources';
import { getCookieHeaderDescriptors, resolveCookieHeaders } from './cookie-headers';
import getResourceParams from './get-resource-params';
import isBodyAllowed from './is-body-allowed';
import isNeedProxy from './is-need-proxy';

export interface Options {
  chain?: ExternalChainExtended;
  csrfToken?: string;
  method?: RequestInit['method'];
  extraHeaders?: HeadersInit;
}

// Works on both the client and the server. On the server there are no cookies, so only the
// cookie-independent part is produced (proxy routing + static per-resource headers).
export default function buildHeaders(resourceName: ResourceName, { chain, csrfToken, method, extraHeaders }: Options = {}): HeadersInit {
  const apiToken = cookies.get(cookies.NAMES.API_TOKEN);
  const rewardsApiToken = cookies.get(cookies.NAMES.REWARDS_API_TOKEN);

  const { api, apiName, resource } = getResourceParams(resourceName, chain);
  const withBody = isBodyAllowed(method);

  return pickBy({
    'x-endpoint': isNeedProxy() ? api.endpoint : undefined,
    Authorization: [ 'admin', 'contractInfo' ].includes(apiName) ? apiToken : undefined,
    'x-csrf-token': [ 'core', 'admin', 'contractInfo' ].includes(apiName) && withBody && csrfToken ? csrfToken : undefined,
    ...resolveCookieHeaders(getCookieHeaderDescriptors(apiName)),
    ...(apiName === 'rewards' && rewardsApiToken ? {
      Authorization: `Bearer ${ rewardsApiToken }`,
    } : {}),
    ...resource.headers,
    ...extraHeaders,
  }, Boolean) as HeadersInit;
}
