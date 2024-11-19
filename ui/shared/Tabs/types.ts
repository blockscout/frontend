import type React from 'react';

export interface TabItem {
  // NOTE, in case of array of ids, when switching tabs, the first id will be used
  // switching between other ids should be handled in the underlying component
  id: string | Array<string>;
  title: string | (() => React.ReactNode);
  count?: number | null;
  component: React.ReactNode;
}

export type RoutedTab = TabItem & { subTabs?: Array<string> };

export type RoutedSubTab = Omit<TabItem, 'subTabs'>;

export interface MenuButton {
  id: null;
  title: string;
  count?: never;
  component: null;
}
