// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TokenInfoApplication } from 'client/features/account/types/api';

export type TokenVerifiedInfo = Omit<TokenInfoApplication, 'id' | 'status'>;
