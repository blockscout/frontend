// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiResource } from '../types';
import type * as tac from '@blockscout/tac-operation-lifecycle-types';

export const TAC_OPERATION_LIFECYCLE_API_RESOURCES = {
  operations: {
    path: '/api/v2/tac/operations',
    paginated: true,
    filterFields: [ 'q' ],
  },
  operation: {
    path: '/api/v2/tac/operations/:id',
    pathParams: [ 'id' ],
  },
  operation_by_tx_hash: {
    path: '/api/v2/tac/operations\\:byTx/:tx_hash',
    pathParams: [ 'tx_hash' ],
  },
} satisfies Record<string, ApiResource>;

export type TacOperationLifecycleApiResourceName = `tac:${ keyof typeof TAC_OPERATION_LIFECYCLE_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type TacOperationLifecycleApiResourcePayload<R extends TacOperationLifecycleApiResourceName> =
R extends 'tac:operations' ? tac.V2OperationsResponse :
R extends 'tac:operation' ? tac.V2OperationDetails :
R extends 'tac:operation_by_tx_hash' ? tac.V2OperationsFullResponse :
never;
/* eslint-enable @stylistic/indent */

/* eslint-disable @stylistic/indent */
export type TacOperationLifecycleApiPaginationFilters<R extends TacOperationLifecycleApiResourceName> =
R extends 'tac:operations' ? { q: string } :
never;
/* eslint-enable @stylistic/indent */
