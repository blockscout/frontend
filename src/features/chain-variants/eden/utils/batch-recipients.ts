// SPDX-License-Identifier: LicenseRef-Blockscout

import { uniqBy } from 'es-toolkit';

import type { schemas } from '@blockscout/api-types';

type TransactionEdenCalls = NonNullable<schemas['TransactionResponse']['calls']>;
type TransactionEdenCall = TransactionEdenCalls[number];

interface BatchRecipient extends TransactionEdenCall {
  readonly to: string;
}

export const MAX_VISIBLE_RECIPIENTS = 5;

const EMPTY_CALLS: TransactionEdenCalls = [];

export interface BatchRecipients {
  readonly count: number;
  readonly hasMultipleRecipients: boolean;
  readonly visibleRecipients: ReadonlyArray<BatchRecipient>;
  readonly hasOverflow: boolean;
}

export function getBatchRecipients(calls: TransactionEdenCalls | null | undefined): BatchRecipients {
  const addressedCalls = (calls ?? EMPTY_CALLS).filter((call): call is BatchRecipient => call.to !== null);
  const uniqueRecipients = uniqBy(addressedCalls, (call) => call.to);
  const count = uniqueRecipients.length;

  return {
    count,
    hasMultipleRecipients: count > 1,
    visibleRecipients: uniqueRecipients.slice(0, MAX_VISIBLE_RECIPIENTS),
    hasOverflow: count > MAX_VISIBLE_RECIPIENTS,
  };
}
