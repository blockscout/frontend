// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouterContext } from 'src/toolkit/router/context';

export function usePathname(): string | null {
  return useRouterContext().pathname;
}
