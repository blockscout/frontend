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

import type { ArrayElement } from '../utils';

export const NAVIGATION_LINK_IDS = [ 'rpc_api', 'eth_rpc_api' ] as const;
export type NavigationLinkId = ArrayElement<typeof NAVIGATION_LINK_IDS>;

export type NavigationLayout = 'vertical' | 'horizontal';
