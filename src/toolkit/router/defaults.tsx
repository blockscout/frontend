// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Router, RouterContextValue, RouterLinkProps } from './types';

import { formatUrl } from './format-url';

export const DefaultLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  function DefaultLink({ href, scroll, shallow, prefetch, children, ...rest }, ref) {
    return <a ref={ ref } href={ formatUrl(href) } { ...rest }>{ children }</a>;
  },
);

const EMPTY_QUERY = {};

export const defaultRouter: Router = {
  query: EMPTY_QUERY,
  pathname: '',
  asPath: '',
  push: () => Promise.resolve(false),
  replace: () => Promise.resolve(false),
};

export const defaultRouterContextValue: RouterContextValue = {
  Link: DefaultLink,
  router: defaultRouter,
  pathname: null,
};
