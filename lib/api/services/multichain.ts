import type { ApiResource } from '../types';
import type * as multichain from '@blockscout/multichain-aggregator-types';

export const MULTICHAIN_API_RESOURCES = {
  interop_messages: {
    path: '/api/v1/interop/messages',
    paginated: true,
  },
} satisfies Record<string, ApiResource>;

export type MultichainApiResourceName = `multichain:${ keyof typeof MULTICHAIN_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type MultichainApiResourcePayload<R extends MultichainApiResourceName> =
R extends 'multichain:interop_messages' ? multichain.ListInteropMessagesResponse :
never;
/* eslint-enable @stylistic/indent */
