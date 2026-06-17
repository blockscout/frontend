// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { Transaction } from 'src/slices/tx/types/api';

export type WrappedTransactionFields = 'decoded_input' | 'fee' | 'gas_limit' | 'gas_price' | 'hash' | 'max_fee_per_gas' |
'max_priority_fee_per_gas' | 'method' | 'nonce' | 'raw_input' | 'to' | 'type' | 'value';

export interface TransactionSuave {
  execution_node?: schemas['Address'] | null;
  allowed_peekers?: Array<string>;
  wrapped?: Pick<Transaction, WrappedTransactionFields>;
}
