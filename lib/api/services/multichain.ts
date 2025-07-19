import type { ApiResource } from '../types';
import type * as multichain from '@blockscout/multichain-aggregator-types';

export const MULTICHAIN_API_RESOURCES = {
  interop_messages: {
    path: '/messages',
    filterFields: [ 'address' as const ],
    paginated: true,
  },
  interop_messages_count: {
    path: '/messages/count',
    filterFields: [ 'address' as const ],
  },
} satisfies Record<string, ApiResource>;

export type MultichainApiResourceName = `multichain:${ keyof typeof MULTICHAIN_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type MultichainApiResourcePayload<R extends MultichainApiResourceName> =
R extends 'multichain:interop_messages' ? multichain.ListInteropMessagesResponse :
R extends 'multichain:interop_messages_count' ? multichain.CountInteropMessagesResponse :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type MultichainApiPaginationFilters<R extends MultichainApiResourceName> =
R extends 'multichain:interop_messages' ? Partial<multichain.ListInteropMessagesRequest> :
R extends 'multichain:interop_messages_count' ? Partial<multichain.CountInteropMessagesRequest> :
never;
/* eslint-enable @stylistic/indent */
