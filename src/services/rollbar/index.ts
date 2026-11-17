// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as queue from './queue';

export type { RollbarClient } from './queue';

/**
 * Kicks off deferred Rollbar init (idle) and installs early window error listeners. Children
 * render immediately — the SDK chunk is not on the critical path.
 */
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

/**
 * Returns the buffering Rollbar client when configured, else `undefined`. Methods are safe to call
 * before the SDK chunk has loaded — they queue until init flushes them.
 */
export function useRollbar(): queue.RollbarClient | undefined {
  return queue.getClient();
}
