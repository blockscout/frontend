// SPDX-License-Identifier: LicenseRef-Blockscout

import type { IconName } from 'public/icons/name';

export interface NavLink {
  text: string;
  href?: string;
  onClick?: () => void;
  icon: IconName;
}
