import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import { Link as ChakraLink, LinkBox as ChakraLinkBox, LinkOverlay as ChakraLinkOverlay } from '@chakra-ui/react';
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

interface LinkPropsChakra extends ChakraLinkProps {
  loading?: boolean;
  external?: boolean;
  iconColor?: ChakraLinkProps['color'];
  noIcon?: boolean;
  disabled?: boolean;
}

interface LinkPropsNext extends Pick<NextLinkProps, 'shallow' | 'prefetch' | 'scroll'> {}

export interface LinkProps extends LinkPropsChakra, LinkPropsNext {}

const splitProps = (props: LinkProps): { chakra: LinkPropsChakra; next: NextLinkProps } => {
  const { scroll = true, shallow = false, prefetch = false, ...rest } = props;

  return {
    chakra: rest,
    next: {
      href: rest.href as NextLinkProps['href'],
      scroll,
      shallow,
      prefetch,
    },
  };
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const { chakra, next } = splitProps(props);
    const { external, loading, href, children, disabled, noIcon, iconColor, ...rest } = chakra;

    if (external) {
      return (
        <Skeleton loading={ loading } ref={ ref as React.ForwardedRef<HTMLDivElement> } asChild>
          <ChakraLink
            href={ href }
            className="group"
            target="_blank"
            rel="noopener noreferrer"
            { ...(disabled ? { 'data-disabled': true } : {}) }
            { ...rest }
          >
            { children }
            { !noIcon && <LinkExternalIcon color={ iconColor }/> }
          </ChakraLink>
        </Skeleton>
      );
    }

    return (
      <Skeleton loading={ loading } ref={ ref as React.ForwardedRef<HTMLDivElement> } asChild>
        <ChakraLink
          asChild
          { ...(disabled ? { 'data-disabled': true } : {}) }
          { ...rest }
        >
          { next.href ? (
            <NextLink { ...next }>
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

export const LinkBox = ChakraLinkBox;

export const LinkOverlay = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkOverlay(props, ref) {
    const { chakra, next } = splitProps(props);
    const { children, external, ...rest } = chakra;

    if (external) {
      return (
        <ChakraLinkOverlay ref={ ref } target="_blank" rel="noopener noreferrer" { ...rest }>
          { children }
        </ChakraLinkOverlay>
      );
    }

    return (
      <ChakraLinkOverlay ref={ ref } asChild={ Boolean(next.href) } { ...rest }>
        { next.href ? <NextLink { ...next }>{ children }</NextLink> : children }
      </ChakraLinkOverlay>
    );
  },
);
