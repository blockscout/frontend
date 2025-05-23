import type React from 'react';

import type { Route } from 'nextjs-routes';

import type { IconName } from 'ui/shared/IconSvg';

type NavIconOrComponent = {
  icon?: IconName;
} | {
  iconComponent?: React.FC<{ size?: number; className?: string }>;
};

type NavItemCommon = {
  text: string;
} & NavIconOrComponent;

export type NavItemInternal = NavItemCommon & {
  nextRoute: Route;
  isActive?: boolean;
};

export type NavItemExternal = {
  text: string;
  url: string;
};

export type NavItem = NavItemInternal | NavItemExternal;

export type NavGroupItem = NavItemCommon & {
  isActive?: boolean;
  subItems: Array<NavItem> | Array<Array<NavItem>>;
};

export type NavigationLayout = 'vertical' | 'horizontal';
