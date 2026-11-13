// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { TxInterpretationVariable } from 'src/features/tx-interpretation/common/types/api';

import type { SummaryTemplateParts } from 'src/features/tx-interpretation/common/utils/utils';

type Address = schemas['Address'];

export type TransferAsset =
  { readonly type: 'native' } |
  { readonly type: 'token'; readonly token: schemas['Token'] };

export interface CallSummary {
  readonly type: 'call';
  readonly method: string;
  readonly from: Address;
  readonly to: Address;
}

export interface TransferSummary {
  readonly type: 'transfer';
  readonly amount: string;
  readonly asset: TransferAsset;
  readonly from: Address;
  readonly to: Address | null;
}

export interface SentenceSummary {
  readonly type: 'sentence';
  readonly actionType: string | null;
  readonly template: SummaryTemplateParts;
  readonly variables: Record<string, TxInterpretationVariable>;
  readonly from: Address;
  readonly to: Address | null;
}

export type ReceiptSummary = CallSummary | TransferSummary | SentenceSummary;
