import { Box, chakra, Skeleton } from '@chakra-ui/react';
import type { As } from '@chakra-ui/react';
import React from 'react';

import IconBase from 'ui/shared/chakra/Icon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

import { getPropsForSize, type Size } from './utils';

export type HashTruncation = 'constant' | 'dynamic' | 'none';

export interface EntityBaseProps {
  className?: string;
  isLoading?: boolean;
  size?: Size;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  isExternal?: boolean;
  href?: string;
  noIcon?: boolean;
  withCopy?: boolean;
  tailLength?: number;
  truncation?: HashTruncation;
}

export interface LinkBaseProps extends Pick<EntityBaseProps, 'className' | 'onClick' | 'isLoading' | 'isExternal' | 'href'> {
  children: React.ReactNode;
}

const Link = chakra(({ className, isLoading, children, isExternal, onClick, href }: LinkBaseProps) => {
  const Component = isExternal ? LinkExternal : LinkInternal;

  return (
    <Component
      className={ className }
      href={ href }
      display="flex"
      alignItems="center"
      minWidth={ 0 } // for content truncation - https://css-tricks.com/flexbox-truncated-text/
      isLoading={ isLoading }
      onClick={ onClick }
    >
      { children }
    </Component>
  );
});

export interface IconBaseProps extends Pick<EntityBaseProps, 'isLoading' | 'size' | 'noIcon'> {
  asProp: As;
}

const Icon = ({ isLoading, size, noIcon, asProp }: IconBaseProps) => {
  if (noIcon) {
    return null;
  }

  const styles = getPropsForSize(size).icon;
  return (
    <Box marginRight={ styles.marginRight }>
      <IconBase
        as={ asProp }
        boxSize={ styles.boxSize }
        isLoading={ isLoading }
        borderRadius="base"
      />
    </Box>
  );
};

export interface ContentBaseProps extends Pick<EntityBaseProps, 'className' | 'isLoading' | 'truncation' | 'tailLength'> {
  asProp?: As;
  text: string;
}

const Content = chakra(({ className, isLoading, asProp, text, truncation = 'dynamic', tailLength }: ContentBaseProps) => {

  const children = (() => {
    switch (truncation) {
      case 'constant':
        return (
          <HashStringShorten
            hash={ text }
            as={ asProp }
          />
        );
      case 'dynamic':
        return (
          <HashStringShortenDynamic
            hash={ text }
            as={ asProp }
            tailLength={ tailLength }
          />
        );
      case 'none':
        return <chakra.span as={ asProp }>{ text }</chakra.span>;
    }
  })();

  return (
    <Skeleton
      className={ className }
      isLoaded={ !isLoading }
      overflow="hidden"
      whiteSpace="nowrap"
    >
      { children }
    </Skeleton>
  );
});

const Copy = CopyToClipboard;

export {
  Link,
  Icon,
  Copy,
  Content,
};
