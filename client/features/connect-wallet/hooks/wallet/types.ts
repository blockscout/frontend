// SPDX-License-Identifier: LicenseRef-Blockscout

import type * as mixpanel from 'client/shared/analytics/mixpanel';

export interface Params {
  source: mixpanel.EventPayload<mixpanel.EventTypes.WALLET_CONNECT>['Source'];
  onConnect?: () => void;
}

export interface Result {
  connect: () => void;
  disconnect: () => void;
  isOpen: boolean;
  isConnected: boolean;
  isReconnecting: boolean;
  address: string | undefined;
  openModal: () => void;
  type?: 'dynamicwaas';
}
