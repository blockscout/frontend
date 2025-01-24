import type { MenuButton, TabItem } from './types';

import { middot } from 'lib/html-entities';

export const menuButton: MenuButton = {
  id: 'menu',
  title: `${ middot }${ middot }${ middot }`,
  component: null,
};

export const getTabValue = (tab: MenuButton | TabItem): string => tab.id.toString();
