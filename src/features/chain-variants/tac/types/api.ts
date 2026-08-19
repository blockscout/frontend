// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

/**
 * The operation object embedded in the **core** `/api/v2/search` response. Core proxies the
 * `tac-operation-lifecycle` Read API v2 brief object, so the fields are the service's own — except that
 * core publishes an absent field as `null` where the service's proto omits it.
 */
export interface TacOperationSearchPayload extends Omit<tac.V2OperationBriefDetails, 'sender' | 'error_reason'> {
  sender?: tac.V2BlockchainAddress | null;
  error_reason?: string | null;
}

export interface SearchResultTacOperation {
  type: 'tac_operation';
  tac_operation: TacOperationSearchPayload;
  priority: number;
}
