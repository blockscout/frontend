// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

export interface SearchResultTacOperation {
  type: 'tac_operation';
  tac_operation: tac.OperationDetails;
}
