// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export type ZilliqaQuorumCertificate = NonNullable<NonNullable<schemas['BlockResponse']['zilliqa']>['quorum_certificate']>;

export type ZilliqaAggregateQuorumCertificate = NonNullable<NonNullable<schemas['BlockResponse']['zilliqa']>['aggregate_quorum_certificate']>;
