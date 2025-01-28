import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react';
import { Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import { Skeleton } from './skeleton';

export interface LinkProps extends ChakraLinkProps {
  loading?: boolean;
  external?: boolean;
  scroll?: boolean;
  iconColor?: ChakraLinkProps['color'];
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const { external, loading, href, children, scroll = true, iconColor, ...rest } = props;

    if (external) {
      return (
        <Skeleton loading={ loading } asChild>
          <ChakraLink
            ref={ ref }
            href={ href }
            className="group"
            target="_blank"
            rel="noopener noreferrer" { ...rest }
          >
            { children }
            <IconSvg
              name="link_external"
              boxSize={ 3 }
              verticalAlign="middle"
              color={ iconColor ?? 'icon.externalLink' }
              _groupHover={{
                color: 'inherit',
              }}
              flexShrink={ 0 }
            />
          </ChakraLink>
        </Skeleton>
      );
    }

    return (
      <Skeleton loading={ loading } asChild>
        <ChakraLink asChild ref={ ref } { ...rest }>
          { href ? <NextLink href={ href as NextLinkProps['href'] } scroll={ scroll }>{ children }</NextLink> : <span>{ children }</span> }
        </ChakraLink>
      </Skeleton>
    );
  },
);
