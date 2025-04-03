import { chakra, Flex } from '@chakra-ui/react';
import type { IconProps } from '@chakra-ui/react';
import React from 'react';

import type { LinkProps } from 'toolkit/chakra/link';
import { Link as LinkToolkit } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import type { Props as CopyToClipboardProps } from 'ui/shared/CopyToClipboard';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
import TruncatedValue from 'ui/shared/TruncatedValue';

import { getContentProps, getIconProps } from './utils';

export type Truncation = 'constant' | 'constant_long' | 'dynamic' | 'tail' | 'none';

export interface EntityBaseProps {
  className?: string;
  href?: string;
  icon?: EntityIconProps;
  isExternal?: boolean;
  isLoading?: boolean;
  isTooltipDisabled?: boolean;
  noCopy?: boolean;
  noIcon?: boolean;
  noLink?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  query?: Record<string, string>;
  tailLength?: number;
  target?: React.HTMLAttributeAnchorTarget;
  truncation?: Truncation;
  variant?: 'content' | 'heading' | 'subheading';
  linkVariant?: LinkProps['variant'];
}

export interface ContainerBaseProps extends Pick<EntityBaseProps, 'className'> {
  children: React.ReactNode;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

const Container = chakra(({ className, children, ...props }: ContainerBaseProps) => {
  return (
    <Flex
      className={ className }
      alignItems="center"
      minWidth={ 0 } // for content truncation - https://css-tricks.com/flexbox-truncated-text/
      { ...props }
    >
      { children }
    </Flex>
  );
});

export interface LinkBaseProps extends Pick<EntityBaseProps, 'className' | 'onClick' | 'isLoading' | 'isExternal' | 'href' | 'noLink' | 'query'> {
  children: React.ReactNode;
  variant?: LinkProps['variant'];
}

const Link = chakra(({ isLoading, children, isExternal, onClick, href, noLink, variant }: LinkBaseProps) => {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 0, // for content truncation - https://css-tricks.com/flexbox-truncated-text/
  };

  if (noLink) {
    return null;
  }

  return (
    <LinkToolkit
      { ...styles }
      href={ href }
      loading={ isLoading }
      external={ isExternal }
      onClick={ onClick }
      variant={ variant }
    >
      { children }
    </LinkToolkit>
  );
});

interface EntityIconProps extends Pick<IconProps, 'color' | 'borderRadius' | 'marginRight' | 'boxSize'> {
  name?: IconName;
}

export interface IconBaseProps extends Pick<EntityBaseProps, 'isLoading' | 'noIcon' | 'variant'>, EntityIconProps {}

const Icon = ({ isLoading, noIcon, variant, name, color, borderRadius, marginRight, boxSize }: IconBaseProps) => {
  if (noIcon || !name) {
    return null;
  }

  const styles = getIconProps(variant);
  return (
    <IconSvg
      name={ name }
      boxSize={ boxSize ?? styles.boxSize }
      isLoading={ isLoading }
      borderRadius={ borderRadius ?? 'base' }
      display="block"
      mr={ marginRight ?? 2 }
      color={ color ?? { _light: 'gray.500', _dark: 'gray.400' } }
      minW={ 0 }
      flexShrink={ 0 }
    />
  );
};

export interface ContentBaseProps extends Pick<EntityBaseProps, 'className' | 'isLoading' | 'truncation' | 'tailLength' | 'isTooltipDisabled' | 'variant'> {
  asProp?: React.ElementType;
  text: string;
}

const Content = chakra(({ className, isLoading, asProp, text, truncation = 'dynamic', tailLength, isTooltipDisabled, variant }: ContentBaseProps) => {
  const styles = getContentProps(variant);

  if (truncation === 'tail') {
    return (
      <TruncatedValue
        className={ className }
        isLoading={ isLoading }
        value={ text }
        { ...styles }
      />
    );
  }

  const children = (() => {
    switch (truncation) {
      case 'constant_long':
        return (
          <HashStringShorten
            hash={ text }
            as={ asProp }
            type="long"
            isTooltipDisabled={ isTooltipDisabled }
          />
        );
      case 'constant':
        return (
          <HashStringShorten
            hash={ text }
            as={ asProp }
            isTooltipDisabled={ isTooltipDisabled }
          />
        );
      case 'dynamic':
        return (
          <HashStringShortenDynamic
            hash={ text }
            as={ asProp }
            tailLength={ tailLength }
            isTooltipDisabled={ isTooltipDisabled }
          />
        );
      case 'none':
        return <chakra.span as={ asProp }>{ text }</chakra.span>;
    }
  })();

  return (
    <Skeleton
      className={ className }
      loading={ isLoading }
      overflow="hidden"
      whiteSpace="nowrap"
      w="100%"
      { ...styles }
    >
      { children }
    </Skeleton>
  );
});

export type CopyBaseProps = Pick<CopyToClipboardProps, 'isLoading' | 'text'> & Pick<EntityBaseProps, 'noCopy'>;

const Copy = ({ noCopy, ...props }: CopyBaseProps) => {
  if (noCopy) {
    return null;
  }

  return <CopyToClipboard { ...props }/>;
};

export {
  Container,
  Link,
  Icon,
  Copy,
  Content,
};
