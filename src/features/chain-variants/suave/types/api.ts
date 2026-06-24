// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export interface TransactionSuave {
  execution_node?: schemas['Address'] | null;
  allowed_peekers?: Array<string>;
  wrapped?: schemas['TransactionResponse']['wrapped'];
}
