// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export type AddressCeloAccount = NonNullable<NonNullable<NonNullable<NonNullable<schemas['AddressResponse']>['celo']>>['account']>;

export type BlockBaseFeeCelo = NonNullable<NonNullable<NonNullable<NonNullable<schemas['BlockResponse']>['celo']>>['base_fee']>;
