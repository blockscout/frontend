// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Route } from 'src/shared/router/routes';
import type { Router } from 'src/shared/router/useRouter';

export interface NavLocation {
  readonly pathname: Route['pathname'];
  readonly tab: Router['query'][string];
}
