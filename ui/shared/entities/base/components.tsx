import { Box, chakra, Flex } from '@chakra-ui/react';
import type { IconProps } from '@chakra-ui/react';
import React from 'react';

import type { ChainConfig } from 'types/multichain';

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
import type { Props as IconSvgProps } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
import TruncatedValue from 'ui/shared/TruncatedValue';

import { getContentProps, getIconProps } from './utils';

export type Truncation = 'constant' | 'constant_long' | 'dynamic' | 'tail' | 'none';
export type Variant = 'content' | 'heading' | 'subheading';

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
  truncationMaxSymbols?: number;
  variant?: Variant;
  linkVariant?: LinkProps['variant'];
  chain?: ChainConfig;
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

export interface LinkBaseProps extends Pick<EntityBaseProps, 'className' | 'onClick' | 'isLoading' | 'isExternal' | 'href' | 'noLink' | 'query' | 'chain'> {
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

type EntityIconProps = (ImageProps | IconSvgProps) & Pick<IconProps, 'color' | 'borderRadius' | 'marginRight' | 'boxSize'> & {
  shield?: IconShieldProps;
  hint?: string;
  hintPostfix?: string;
  tooltipInteractive?: boolean;
};

export type IconBaseProps = Pick<EntityBaseProps, 'isLoading' | 'noIcon' | 'variant' | 'chain'> & EntityIconProps;

const Icon = (props: IconBaseProps) => {
  const { isLoading, noIcon, variant, color, borderRadius, marginRight, boxSize, shield, hint, tooltipInteractive, ...rest } = props;

  if (noIcon) {
    return null;
  }

  const styles = getIconProps(props, Boolean(shield));

  const iconElement = (() => {
    const commonProps = {
      marginRight: styles.marginRight,
      boxSize: boxSize ?? styles.boxSize,
      borderRadius: borderRadius ?? 'base',
      flexShrink: 0,
      minW: 0,
    };

    if (isLoading) {
      return <Skeleton loading { ...commonProps }/>;
    }

    if ('src' in props) {
      return <Image { ...commonProps } { ...rest }/>;
    }

    const svgProps = rest as IconSvgProps;

    return (
      <IconSvg
        display="block"
        color={ color ?? 'icon.primary' }
        { ...commonProps }
        { ...svgProps }
      />
    );
  })();

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
    <Box position="relative" display="inline-flex" alignItems="center" flexShrink={ 0 }>
      { iconElementWithHint }
      <IconShield isLoading={ isLoading } variant={ variant } { ...shield }/>
    </Box>
  );
};

type IconShieldProps = (ImageProps | IconSvgProps) & { isLoading?: boolean; variant?: Variant };

const IconShield = (props: IconShieldProps) => {
  const { variant, ...rest } = props;

  const styles = {
    position: 'absolute',
    top: variant === 'heading' ? '14px' : '6px',
    left: variant === 'heading' ? '18px' : '12px',
    boxSize: '18px',
    borderRadius: 'full',
    borderWidth: '1px',
    borderStyle: 'solid',
    // The colors can be changed on hover, if address is highlighted
    // Because the highlighted styles are described as CSS classes, we must do the same for the shield border color.
    // borderColor: 'bg.primary',
    // backgroundColor: 'bg.primary',
    className: 'entity__shield',
  };

  if ('src' in rest) {
    return rest.isLoading ? <Skeleton loading { ...styles }/> : <Image { ...styles } { ...rest }/>;
  }

  const svgProps = rest as IconSvgProps;

  return <IconSvg { ...styles } { ...svgProps }/>;
};

export interface ContentBaseProps extends Pick<
  EntityBaseProps, 'className' | 'isLoading' | 'truncation' | 'tailLength' | 'noTooltip' | 'variant' | 'truncationMaxSymbols'
> {
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
  truncationMaxSymbols,
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
            maxSymbols={ truncationMaxSymbols }
          />
        );
      case 'constant':
        return (
          <HashStringShorten
            hash={ text }
            as={ asProp }
            noTooltip={ noTooltip }
            tooltipInteractive={ tooltipInteractive }
            maxSymbols={ truncationMaxSymbols }
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
