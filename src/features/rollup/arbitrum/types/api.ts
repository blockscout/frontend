// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export type ArbitrumBatchStatus = Exclude<schemas['Block']['arbitrum'], undefined>['status'];

export type NewArbitrumBatchSocketResponse = { batch: schemas['ArbitrumBatch'] };

export type ArbitrumTransactionMessageStatus =
  NonNullable<NonNullable<NonNullable<schemas['Transaction']['arbitrum']>['message_related_info']>['message_status']>;
