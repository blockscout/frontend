// SPDX-License-Identifier: LicenseRef-Blockscout

export type ItemType = 'button' | 'menu_item';

export interface ItemProps {
  type: ItemType;
  hash: string;
}
