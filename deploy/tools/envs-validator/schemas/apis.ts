// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envBoolean, envJson, envPositiveInteger, envRequiredString, envUrl, protocols, requires } from '../utils';

const statsApiRefetchIntervalSchema = envJson(v.strictObject({
  'stats:counters': v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  'stats:pages_main': v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
}));

export default v.pipe(
  v.object({
    NEXT_PUBLIC_API_PROTOCOL: v.optional(v.picklist(protocols)),
    NEXT_PUBLIC_API_HOST: envRequiredString(),
    NEXT_PUBLIC_API_PORT: v.optional(envPositiveInteger()),
    NEXT_PUBLIC_API_BASE_PATH: v.optional(v.string()),
    NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL: v.optional(v.picklist([ 'ws', 'wss' ])),

    NEXT_PUBLIC_STATS_API_HOST: v.optional(envUrl()),
    NEXT_PUBLIC_STATS_API_BASE_PATH: v.optional(v.string()),
    NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL: v.optional(statsApiRefetchIntervalSchema),

    NEXT_PUBLIC_VISUALIZE_API_HOST: v.optional(envUrl()),
    NEXT_PUBLIC_VISUALIZE_API_BASE_PATH: v.optional(v.string()),

    NEXT_PUBLIC_CONTRACT_INFO_API_HOST: v.optional(envUrl()),
    NEXT_PUBLIC_CONTRACT_INFO_INSTANCE_ID: v.optional(v.string()),

    NEXT_PUBLIC_ADMIN_SERVICE_API_HOST: v.optional(envUrl()),
    NEXT_PUBLIC_ADMIN_RS_INSTANCE_ID: v.optional(v.string()),

    NEXT_PUBLIC_REWARDS_SERVICE_API_HOST: v.optional(envUrl()),

    NEXT_PUBLIC_METADATA_SERVICE_API_HOST: v.optional(envUrl()),
    NEXT_PUBLIC_METADATA_ADDRESS_TAGS_UPDATE_ENABLED: v.optional(envBoolean()),
  }),
  requires('NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL', 'NEXT_PUBLIC_STATS_API_HOST'),
  requires('NEXT_PUBLIC_CONTRACT_INFO_INSTANCE_ID', 'NEXT_PUBLIC_CONTRACT_INFO_API_HOST'),
  requires('NEXT_PUBLIC_ADMIN_RS_INSTANCE_ID', 'NEXT_PUBLIC_ADMIN_SERVICE_API_HOST'),
  requires('NEXT_PUBLIC_METADATA_ADDRESS_TAGS_UPDATE_ENABLED', 'NEXT_PUBLIC_METADATA_SERVICE_API_HOST', {
    message: 'NEXT_PUBLIC_METADATA_ADDRESS_TAGS_UPDATE_ENABLED cannot not be used if NEXT_PUBLIC_METADATA_SERVICE_API_HOST is not defined',
  }),
);
