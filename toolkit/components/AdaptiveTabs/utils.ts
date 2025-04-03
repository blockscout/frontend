import type { TabItem, TabItemMenu } from './types';

import { middot } from 'lib/html-entities';

export const menuButton: TabItemMenu = {
  id: 'menu',
  title: `${ middot }${ middot }${ middot }`,
  component: null,
};

export const getTabValue = (tab: TabItem): string => {
  if (Array.isArray(tab.id)) {
    return tab.id[0];
  }

  return tab.id;
};
