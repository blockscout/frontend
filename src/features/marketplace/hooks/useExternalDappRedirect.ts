// SPDX-License-Identifier: LicenseRef-Blockscout

import { useEffect } from 'react';

export function useExternalDappRedirect(appUrl: string | undefined, isExternal: boolean): void {
  useEffect(() => {
    if (isExternal && appUrl) {
      window.location.replace(appUrl);
    }
  }, [ appUrl, isExternal ]);
}
