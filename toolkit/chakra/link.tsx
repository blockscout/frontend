import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import { Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import { Skeleton } from './skeleton';

export const LinkExternalIcon = ({ color }: { color?: ChakraLinkProps['color'] }) => (
  <IconSvg
    name="link_external"
    boxSize={ 3 }
    verticalAlign="middle"
    color={ color ?? 'icon.externalLink' }
    _groupHover={{
      color: 'inherit',
    }}
    flexShrink={ 0 }
  />
);

export interface LinkProps extends Pick<NextLinkProps, 'shallow' | 'prefetch' | 'scroll'>, ChakraLinkProps {
  loading?: boolean;
  external?: boolean;
  iconColor?: ChakraLinkProps['color'];
  noIcon?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const { external, loading, href, children, scroll = true, iconColor, noIcon, shallow, prefetch = false, ...rest } = props;

    if (external) {
      return (
        <Skeleton loading={ loading } asChild>
          <ChakraLink
            ref={ ref }
            href={ href }
            className="group"
            target="_blank"
            rel="noopener noreferrer"
            { ...rest }
          >
            { children }
            { !noIcon && <LinkExternalIcon color={ iconColor }/> }
          </ChakraLink>
        </Skeleton>
      );
    }

    return (
      <Skeleton loading={ loading } asChild>
        <ChakraLink asChild ref={ ref } { ...rest }>
          { href ? (
            <NextLink
              href={ href as NextLinkProps['href'] }
              scroll={ scroll }
              shallow={ shallow }
              prefetch={ prefetch }
            >
              { children }
            </NextLink>
          ) :
            <span>{ children }</span>
          }
        </ChakraLink>
      </Skeleton>
    );
  },
);
