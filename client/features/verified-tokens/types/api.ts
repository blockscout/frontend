// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TokenInfoApplication } from 'types/api/account';

export type TokenVerifiedInfo = Omit<TokenInfoApplication, 'id' | 'status'>;
