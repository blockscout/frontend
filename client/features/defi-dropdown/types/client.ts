// SPDX-License-Identifier: LicenseRef-Blockscout

import type { IconName } from 'client/sprite/SpriteIcon';

export type DeFiDropdownItem = {
  text: string;
  icon?: IconName;
} & (
  { dappId: string; isEssentialDapp?: boolean; url?: never } |
  { url: string; dappId?: never; isEssentialDapp?: never }
);
