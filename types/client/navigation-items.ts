import type { Route } from 'nextjs-routes';

type NavItemCommon = {
  text: string;
  icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

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
