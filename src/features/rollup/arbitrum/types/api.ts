// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { ExcludeUndefined } from 'src/shared/types/utils';

export type ArbitrumBatchStatus = ExcludeUndefined<schemas['Block']['arbitrum']>['status'];

export type NewArbitrumBatchSocketResponse = { batch: schemas['ArbitrumBatch'] };

export type ArbitrumTransactionMessageStatus =
  NonNullable<NonNullable<NonNullable<schemas['Transaction']['arbitrum']>['message_related_info']>['message_status']>;
