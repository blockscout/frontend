// eslint-disable-next-line no-restricted-imports
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import type { ReactNode } from 'react';

type LinkProps = NextLinkProps & { children?: ReactNode };

const Link = ({ prefetch = false, children, ...rest }: LinkProps) => {
  return (
    <NextLink prefetch={ prefetch } { ...rest }>
      { children }
    </NextLink>
  );
};

export default Link;
