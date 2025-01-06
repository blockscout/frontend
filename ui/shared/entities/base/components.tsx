import { chakra, Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { As, IconProps } from '@chakra-ui/react';
import React from 'react';

import type { Props as CopyToClipboardProps } from 'ui/shared/CopyToClipboard';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';
import LinkInternal from 'ui/shared/links/LinkInternal';

import { getIconProps, type IconSize } from './utils';

export type Truncation = 'constant' | 'constant_long' | 'dynamic' | 'tail' | 'none';

export interface EntityBaseProps {
  className?: string;
  href?: string;
  icon?: EntityIconProps;
  isExternal?: boolean;
  isLoading?: boolean;
  noCopy?: boolean;
  noIcon?: boolean;
  noLink?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  query?: Record<string, string>;
  tailLength?: number;
  target?: React.HTMLAttributeAnchorTarget;
  truncation?: Truncation;
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
}

const Link = chakra(({ isLoading, children, isExternal, onClick, href, noLink }: LinkBaseProps) => {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 0, // for content truncation - https://css-tricks.com/flexbox-truncated-text/
  };

  if (noLink) {
    return <Skeleton isLoaded={ !isLoading } { ...styles }>{ children }</Skeleton>;
  }

  const Component = isExternal ? LinkExternal : LinkInternal;

  return (
    <Component
      { ...styles }
      href={ href }
      isLoading={ isLoading }
      onClick={ onClick }
    >
      { children }
    </Component>
  );
});

interface EntityIconProps extends Pick<IconProps, 'color' | 'borderRadius' | 'marginRight' | 'boxSize'> {
  name?: IconName;
  size?: IconSize;
}

export interface IconBaseProps extends Pick<EntityBaseProps, 'isLoading' | 'noIcon'>, EntityIconProps {}

const Icon = ({ isLoading, noIcon, size, name, color, borderRadius, marginRight, boxSize }: IconBaseProps) => {
  const defaultColor = useColorModeValue('gray.500', 'gray.400');

  if (noIcon || !name) {
    return null;
  }

  const styles = getIconProps(size);
  return (
    <IconSvg
      name={ name }
      boxSize={ boxSize ?? styles.boxSize }
      isLoading={ isLoading }
      borderRadius={ borderRadius ?? 'base' }
      display="block"
      mr={ marginRight ?? 2 }
      color={ color ?? defaultColor }
      minW={ 0 }
      flexShrink={ 0 }
    />
  );
};

export interface ContentBaseProps extends Pick<EntityBaseProps, 'className' | 'isLoading' | 'truncation' | 'tailLength'> {
  asProp?: As;
  text: string;
  isTooltipDisabled?: boolean;
}

const Content = chakra(({ className, isLoading, asProp, text, truncation = 'dynamic', tailLength, isTooltipDisabled }: ContentBaseProps) => {

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
      case 'tail':
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
      textOverflow={ truncation === 'tail' ? 'ellipsis' : undefined }
    >
      { children }
    </Skeleton>
  );
});

export type CopyBaseProps = Pick<CopyToClipboardProps, 'isLoading' | 'text'> & Pick<EntityBaseProps, 'noCopy'>;

const Copy = (props: CopyBaseProps) => {
  if (props.noCopy) {
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
