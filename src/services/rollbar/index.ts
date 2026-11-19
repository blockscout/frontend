// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as queue from './queue';

export type { RollbarClient } from './queue';

export function Provider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const removeListeners = queue.installEarlyListeners();
    const cancelInit = queue.scheduleInit();
    return () => {
      cancelInit();
      removeListeners();
    };
  }, []);

  return children;
}

export function useRollbar(): queue.RollbarClient | undefined {
  return queue.getClient();
}
