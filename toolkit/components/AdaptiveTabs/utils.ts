import type { TabItem, TabItemMenu } from './types';

import { middot } from 'lib/html-entities';

export const menuButton: TabItemMenu = {
  id: 'menu',
  title: `${ middot }${ middot }${ middot }`,
  component: null,
};

export const getTabValue = (tab: TabItem): string => tab.id.toString();
