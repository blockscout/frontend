export type ItemType = 'button' | 'menu_item';
import type { Route } from 'nextjs-routes';

export interface ItemProps {
  className?: string;
  type: ItemType;
  hash: string;
  onBeforeClick: (route?: Route) => boolean;
}
