import type { NavItem } from 'types/client/navigation-items';

import config from 'configs/app';
import { isInternalItem } from 'lib/hooks/useNavItems';

export default function useLightningLabel(item: NavItem | Array<NavItem> | Array<Array<NavItem>>) {

  function checkForLightningLabel(item: NavItem | Array<NavItem> | Array<Array<NavItem>>): boolean {
    if (Array.isArray(item)) {
      return item.some((subItem) => checkForLightningLabel(subItem));
    }
    return isInternalItem(item) && (config.UI.sidebar.lightningLabels.includes(item.nextRoute.pathname));
  }

  return checkForLightningLabel(item);
}
