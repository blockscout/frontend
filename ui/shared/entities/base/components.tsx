import { Box, chakra, Flex } from '@chakra-ui/react';
import type { IconProps } from '@chakra-ui/react';
import React from 'react';

import type { ImageProps } from 'toolkit/chakra/image';
import { Image } from 'toolkit/chakra/image';
import type { LinkProps } from 'toolkit/chakra/link';
import { Link as LinkToolkit } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import type { Props as CopyToClipboardProps } from 'ui/shared/CopyToClipboard';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import type { IconName, Props as IconSvgProps } from 'ui/shared/IconSvg';
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
  noTooltip?: boolean;
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
  shield?: IconShieldProps;
  hint?: string;
  hintPostfix?: string;
  tooltipInteractive?: boolean;
}

export interface IconBaseProps extends Pick<EntityBaseProps, 'isLoading' | 'noIcon' | 'variant'>, EntityIconProps {}

const Icon = ({ isLoading, noIcon, variant, name, color, borderRadius, marginRight, boxSize, shield, hint, tooltipInteractive }: IconBaseProps) => {
  if (noIcon || !name) {
    return null;
  }

  const styles = getIconProps(variant);

  const iconElement = (
    <IconSvg
      name={ name }
      boxSize={ boxSize ?? styles.boxSize }
      isLoading={ isLoading }
      borderRadius={ borderRadius ?? 'base' }
      display="block"
      mr={ marginRight ?? (shield ? '18px' : '8px') }
      color={ color ?? { _light: 'gray.500', _dark: 'gray.400' } }
      minW={ 0 }
      flexShrink={ 0 }
    />
  );
  const iconElementWithHint = hint ? (
    <Tooltip
      content={ hint }
      interactive={ tooltipInteractive }
      positioning={ shield ? { offset: { mainAxis: 8 } } : undefined }
    >
      { iconElement }
    </Tooltip>
  ) : iconElement;

  if (!shield) {
    return iconElementWithHint;
  }

  return (
    <Box position="relative">
      { iconElementWithHint }
      <IconShield { ...shield }/>
    </Box>
  );
};

type IconShieldProps = (ImageProps | IconSvgProps);

const IconShield = (props: IconShieldProps) => {

  const styles = {
    position: 'absolute',
    top: '6px',
    left: '12px',
    boxSize: '18px',
    borderRadius: 'full',
    borderWidth: '1px',
    borderStyle: 'solid',
    // The colors can be changed on hover, if address is highlighted
    // Because the highlighted styles are described as CSS classes, we must do the same for the shield border color.
    // borderColor: 'global.body.bg',
    // backgroundColor: 'global.body.bg',
  };

  if ('src' in props) {
    return <Image className="entity__shield" { ...styles } { ...props }/>;
  }

  const svgProps = props as IconSvgProps;

  return <IconSvg className="entity__shield" { ...styles } { ...svgProps }/>;
};

export interface ContentBaseProps extends Pick<EntityBaseProps, 'className' | 'isLoading' | 'truncation' | 'tailLength' | 'noTooltip' | 'variant'> {
  asProp?: React.ElementType;
  text: string;
  tooltipInteractive?: boolean;
}

const Content = chakra(({
  className,
  isLoading,
  asProp,
  text,
  truncation = 'dynamic',
  tailLength,
  variant,
  noTooltip,
  tooltipInteractive,
}: ContentBaseProps) => {
  const styles = getContentProps(variant);

  if (truncation === 'tail') {
    return (
      <TruncatedValue
        className={ className }
        isLoading={ isLoading }
        value={ text }
        tooltipInteractive={ tooltipInteractive }
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
            noTooltip={ noTooltip }
            tooltipInteractive={ tooltipInteractive }
          />
        );
      case 'constant':
        return (
          <HashStringShorten
            hash={ text }
            as={ asProp }
            noTooltip={ noTooltip }
            tooltipInteractive={ tooltipInteractive }
          />
        );
      case 'dynamic':
        return (
          <HashStringShortenDynamic
            hash={ text }
            as={ asProp }
            tailLength={ tailLength }
            noTooltip={ noTooltip }
            tooltipInteractive={ tooltipInteractive }
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

export type CopyBaseProps =
  Pick<CopyToClipboardProps, 'isLoading' | 'text' | 'tooltipInteractive'> &
  Pick<EntityBaseProps, 'noCopy' | 'noTooltip'>
;

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
  IconShield,
  Copy,
  Content,
};
