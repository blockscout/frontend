// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable no-restricted-imports -- the one module where the Next.js router primitives are allowed: it adapts them to the toolkit router context */
import NextJsLink from 'next/link';
import type { LinkProps as NextJsLinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter as useNextJsRouter } from 'next/router';
import React from 'react';

import type { Router, RouterContextValue, RouterLinkProps, Url } from 'src/toolkit/router/types';

import { RouterProvider } from 'src/toolkit/router/context';

// `nextjs-routes` narrows the Next `href` / `url` arguments to the generated route union; the toolkit contract
// is framework-neutral and carries no route map, so the value is handed back to Next as it came in.
const toNextJsUrl = (url: Url): NextJsLinkProps['href'] => url as NextJsLinkProps['href'];

export const NextLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  function NextLink({ href, scroll, shallow, prefetch, children, ...rest }, ref) {
    return (
      <NextJsLink ref={ ref } href={ toNextJsUrl(href) } scroll={ scroll } shallow={ shallow } prefetch={ prefetch } { ...rest }>
        { children }
      </NextJsLink>
    );
  },
);

export const useNextRouter = (): Router => {
  const nextRouter = useNextJsRouter();

  return React.useMemo(() => ({
    query: nextRouter.query,
    pathname: nextRouter.pathname,
    asPath: nextRouter.asPath,
    push: (url, options) => nextRouter.push(toNextJsUrl(url), undefined, options),
    replace: (url, options) => nextRouter.replace(toNextJsUrl(url), undefined, options),
  }), [ nextRouter ]);
};

interface Props {
  children: React.ReactNode;
}

const NextRouterProvider = ({ children }: Props) => {
  const router = useNextRouter();
  const pathname = usePathname();

  const value = React.useMemo((): RouterContextValue => ({ Link: NextLink, router, pathname }), [ router, pathname ]);

  return <RouterProvider value={ value }>{ children }</RouterProvider>;
};

export default NextRouterProvider;
