// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TokenInfoApplication } from 'src/features/account/types/api';

export type TokenVerifiedInfo = Omit<TokenInfoApplication, 'id' | 'status'>;
