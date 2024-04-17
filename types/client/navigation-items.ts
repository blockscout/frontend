/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';

import type { Route } from 'nextjs-routes';

import type { IconName } from 'ui/shared/IconSvg';

import type { ArrayElement } from '../utils';

type NavIconOrComponent = {
  icon?: IconName | any;
} | {
  iconComponent?: React.FC<{size?: number}>;
};

type NavItemCommon = {
  text: string;
} & NavIconOrComponent;

export type NavItemInternal = NavItemCommon & {
  nextRoute: Route;
  isActive?: boolean;
}

export type NavItemExternal = {
  text: string;
  url: string;
}

export type NavItem = NavItemInternal | NavItemExternal

export type NavGroupItem = NavItemCommon & {
  isActive?: boolean;
  subItems: Array<NavItem> | Array<Array<NavItem>>;
}

export const NAVIGATION_LINK_IDS = [ 'rpc_api', 'eth_rpc_api' ] as const;
export type NavigationLinkId = ArrayElement<typeof NAVIGATION_LINK_IDS>;
