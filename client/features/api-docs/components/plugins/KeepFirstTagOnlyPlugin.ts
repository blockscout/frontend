// SPDX-License-Identifier: LicenseRef-Blockscout

import { keepFirstTagOnly } from '../../utils/swagger-spec';

export const KeepFirstTagOnlyPlugin = () => {
  return {
    statePlugins: {
      spec: {
        wrapActions: {
          updateJsonSpec: (originalAction: (json: unknown) => unknown) => (json: unknown) => {
            if (json && typeof json === 'object') {
              return originalAction(keepFirstTagOnly(json));
            }
            return originalAction(json);
          },
        },
      },
    },
  };
};
