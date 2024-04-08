import type React from 'react';

export interface TabItem {
  id: string;
  title: string | (() => React.ReactNode);
  count?: number | null;
  component: React.ReactNode;
}

export type RoutedTab = TabItem & { subTabs?: Array<string> }

export type RoutedSubTab = Omit<TabItem, 'subTabs'>;

export interface MenuButton {
  id: null;
  title: string;
  count?: never;
  component: null;
}
