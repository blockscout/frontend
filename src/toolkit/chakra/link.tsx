// SPDX-License-Identifier: LicenseRef-Blockscout

import type { LinkProps as ChakraLinkProps, IconProps } from '@chakra-ui/react';
import { Link as ChakraLink, LinkBox as ChakraLinkBox, LinkOverlay as ChakraLinkOverlay, Icon } from '@chakra-ui/react';
import React from 'react';

import type { RouterLinkProps, Url } from '../router/types';

import stripUtmParams from 'src/shared/links/strip-utm-params';
import ArrowIcon from 'src/sprite/icons/link_external.svg';

import { useLink } from '../router/context';
import { Skeleton } from './skeleton';

export const LinkExternalIcon = ({ color, ...rest }: IconProps) => (
  <Icon
    boxSize={ 3 }
    verticalAlign="middle"
    color={ color ?? 'icon.secondary' }
    _groupHover={{
      color: 'inherit',
    }}
    flexShrink={ 0 }
    { ...rest }
  >
    <ArrowIcon/>
  </Icon>
);

interface LinkPropsChakra extends ChakraLinkProps {
  loading?: boolean;
  external?: boolean;
  iconColor?: ChakraLinkProps['color'];
  noIcon?: boolean;
  disabled?: boolean;
}

interface LinkPropsRouter extends Partial<Pick<RouterLinkProps, 'shallow' | 'prefetch' | 'scroll'>> {}

export interface LinkProps extends LinkPropsChakra, LinkPropsRouter {}

interface RouterLinkPropsMaybeHref extends Omit<RouterLinkProps, 'href'> {
  href: Url | undefined;
}

const splitProps = (props: LinkProps): { chakra: LinkPropsChakra; router: RouterLinkPropsMaybeHref } => {
  const { scroll = true, shallow = false, prefetch = false, ...rest } = props;

  return {
    chakra: rest,
    router: {
      href: rest.href,
      scroll,
      shallow,
      prefetch,
    },
  };
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const RouterLink = useLink();
    const { chakra, router } = splitProps(props);
    const { external, loading, href, children, disabled, noIcon, iconColor, className, ...rest } = chakra;

    if (external) {
      // Strip UTM parameters from external links if in private mode
      const processedHref = typeof href === 'string' ? stripUtmParams(href) : href;

      return (
        <Skeleton loading={ loading } ref={ ref as React.ForwardedRef<HTMLDivElement> } asChild>
          <ChakraLink
            href={ processedHref }
            className={ className ? `group ${ className }` : 'group' }
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
          className={ className }
          { ...(disabled ? { 'data-disabled': true } : {}) }
          { ...rest }
        >
          { router.href ? (
            <RouterLink { ...router } href={ router.href }>
              { children }
            </RouterLink>
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
    const RouterLink = useLink();
    const { chakra, router } = splitProps(props);
    const { children, external, loading, href, noIcon, iconColor, ...rest } = chakra;

    if (external) {
      // Strip UTM parameters from external links if in private mode
      const processedHref = typeof href === 'string' ? stripUtmParams(href) : href;

      return (
        <ChakraLinkOverlay
          ref={ ref }
          href={ loading ? undefined : processedHref }
          target="_blank"
          rel="noopener noreferrer"
          { ...rest }
        >
          { Boolean(children || (!noIcon && href)) && (
            <Skeleton display="inline-flex" alignItems="center" loading={ loading } maxW="100%" h="100%">
              { children }
              { !noIcon && href && <LinkExternalIcon color={ iconColor }/> }
            </Skeleton>
          ) }
        </ChakraLinkOverlay>
      );
    }

    const content = children ? (
      <Skeleton display="inline-flex" alignItems="center" loading={ loading } maxW="100%" h="100%">
        { children }
      </Skeleton>
    ) : null;

    return (
      <ChakraLinkOverlay
        ref={ ref }
        asChild={ Boolean(router.href) }
        { ...rest }
      >
        { router.href ? <RouterLink { ...router } href={ router.href }>{ content }</RouterLink> : content }
      </ChakraLinkOverlay>
    );
  },
);
