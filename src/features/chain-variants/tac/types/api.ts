// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

// Core's `/api/v2/search` embeds the service's brief object, but publishes an absent field as `null` where
// the service's proto omits it.
export interface TacOperationSearchPayload extends Omit<tac.V2OperationBriefDetails, 'sender' | 'error_reason'> {
  sender?: tac.V2BlockchainAddress | null;
  error_reason?: string | null;
}

export interface SearchResultTacOperation {
  type: 'tac_operation';
  tac_operation: TacOperationSearchPayload;
  priority: number;
}
