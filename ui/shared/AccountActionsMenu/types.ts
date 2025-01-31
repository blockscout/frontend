export type ItemType = 'button' | 'menu_item';

export interface ItemProps {
  className?: string;
  type: ItemType;
  hash: string;
}
