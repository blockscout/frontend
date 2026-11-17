// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envJson, envUrl, requires } from '../../utils';

export const nameServicesSchema = v.pipe(
  v.looseObject({
    NEXT_PUBLIC_NAME_SERVICE_API_HOST: v.optional(envUrl()),
    NEXT_PUBLIC_NAME_SERVICE_PROTOCOLS: v.optional(envJson(v.pipe(v.array(v.string()), v.minLength(1)))),

    NEXT_PUBLIC_CLUSTERS_API_HOST: v.optional(envUrl()),
    NEXT_PUBLIC_CLUSTERS_CDN_URL: v.optional(envUrl()),
  }),
  requires('NEXT_PUBLIC_NAME_SERVICE_PROTOCOLS', 'NEXT_PUBLIC_NAME_SERVICE_API_HOST', {
    message: 'NEXT_PUBLIC_NAME_SERVICE_PROTOCOLS cannot not be used if NEXT_PUBLIC_NAME_SERVICE_API_HOST is not set',
  }),
  requires('NEXT_PUBLIC_CLUSTERS_CDN_URL', 'NEXT_PUBLIC_CLUSTERS_API_HOST', {
    message: 'NEXT_PUBLIC_CLUSTERS_CDN_URL cannot not be used if NEXT_PUBLIC_CLUSTERS_API_HOST is not set',
  }),
);
