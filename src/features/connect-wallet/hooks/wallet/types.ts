// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as analytics from 'src/shared/analytics';

export interface Params {
  source: analytics.EventPayload<analytics.EventTypes.WALLET_CONNECT>['Source'];
  onConnect?: () => void;
}

export interface Result {
  connect: () => void;
  disconnect: () => void;
  isOpen: boolean;
  isConnected: boolean;
  isReconnecting: boolean;
  address: string | undefined;
  openModal: () => Promise<void>;
  type?: 'dynamicwaas';
}
