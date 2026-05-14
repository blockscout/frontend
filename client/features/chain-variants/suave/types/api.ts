// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressParam } from 'client/slices/address/types/api';
import type { Transaction } from 'client/slices/tx/types/api';

export type WrappedTransactionFields = 'decoded_input' | 'fee' | 'gas_limit' | 'gas_price' | 'hash' | 'max_fee_per_gas' |
'max_priority_fee_per_gas' | 'method' | 'nonce' | 'raw_input' | 'to' | 'type' | 'value';

export interface TransactionSuave {
  execution_node?: AddressParam | null;
  allowed_peekers?: Array<string>;
  wrapped?: Pick<Transaction, WrappedTransactionFields>;
}
