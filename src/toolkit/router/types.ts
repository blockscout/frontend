// SPDX-License-Identifier: LicenseRef-Blockscout

import type React from 'react';

export type Query = Record<string, string | Array<string> | undefined>;

export interface UrlObject {
  readonly pathname?: string;
  readonly query?: Query | null;
  readonly hash?: string;
}

export type Url = string | UrlObject;

export interface NavigateOptions {
  readonly shallow?: boolean;
  readonly scroll?: boolean;
}

export interface Router {
  readonly query: Query;
  readonly pathname: string;
  readonly asPath: string;
  push(url: Url, options?: NavigateOptions): Promise<boolean>;
  replace(url: Url, options?: NavigateOptions): Promise<boolean>;
}

export interface RouterLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  readonly href: Url;
  readonly scroll?: boolean;
  readonly shallow?: boolean;
  readonly prefetch?: boolean;
  readonly children?: React.ReactNode;
}

export interface RouterLinkPropsWithRef extends RouterLinkProps, React.RefAttributes<HTMLAnchorElement> {}

export type RouterLinkComponent = React.ComponentType<RouterLinkPropsWithRef>;

export interface RouterContextValue {
  readonly Link: RouterLinkComponent;
  readonly router: Router;
  readonly pathname: string | null;
}
