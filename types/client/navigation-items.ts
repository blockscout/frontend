import type React from 'react';

import type { Route } from 'nextjs-routes';

type NavIconOrComponent = {
  icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
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

export type NavItemExternal = NavItemCommon & {
  url: string;
}

export type NavItem = NavItemInternal | NavItemExternal

export type NavGroupItem = NavItemCommon & {
  isActive?: boolean;
  subItems: Array<NavItem> | Array<Array<NavItem>>;
}
