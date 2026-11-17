// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps, JsxStyleProps } from '@chakra-ui/react';
import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import type { Props as CopyToClipboardProps } from 'src/shared/texts/CopyToClipboard';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import SpriteIcon from 'src/sprite/SpriteIcon';
import type { Props as SpriteIconProps } from 'src/sprite/SpriteIcon';

import type { ImageProps } from 'src/toolkit/chakra/image';
import { Image } from 'src/toolkit/chakra/image';
import type { LinkProps as LinkToolkitProps } from 'src/toolkit/chakra/link';
import { Link as LinkToolkit } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';
import type { TruncateTooltipConfig } from 'src/toolkit/components/truncation/Truncate';

import { toTruncationSpec } from './entity-props';
import type { EntityIconExtras, EntityOptions, Variant } from './root';
import { useEntityOptions } from './root';
import { useSplitCssProps } from './split-css-props';
import { getVariantPreset } from './variants';

export type { Truncation, Variant, EntityIconOptions as EntityIconProps } from './root';

export interface ContainerBaseProps extends Omit<HTMLChakraProps<'div'>, 'onClick'> {}

const Container = (props: ContainerBaseProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      minWidth={ 0 } // for content truncation - https://css-tricks.com/flexbox-truncated-text/
      { ...props }
    />
  );
};

export interface LinkBaseProps extends
  Omit<LinkToolkitProps, 'onClick' | 'loading'>,
  Pick<EntityOptions, 'isLoading' | 'noLink' | 'chain' | 'onClick'> {
  children: React.ReactNode;
}

const Link = (props: LinkBaseProps) => {
  const options = useEntityOptions();
  const [ css, rest ] = useSplitCssProps(props);
  const {
    isLoading = options.isLoading,
    noLink = options.noLink,
    children,
    className,
    href,
    external,
    onClick,
    variant,
    noIcon,
    iconColor,
    target,
    rel,
  } = rest;

  if (noLink) {
    return children;
  }

  return (
    <LinkToolkit
      display="inline-flex"
      alignItems="center"
      minWidth={ 0 } // for content truncation - https://css-tricks.com/flexbox-truncated-text/
      { ...css }
      className={ className }
      href={ href }
      loading={ isLoading }
      external={ external }
      onClick={ onClick }
      variant={ variant }
      noIcon={ noIcon }
      iconColor={ iconColor }
      { ...(target !== undefined && { target }) }
      { ...(rel !== undefined && { rel }) }
    >
      { children }
    </LinkToolkit>
  );
};

export interface IconElementProps extends HTMLChakraProps<'div'> {
  children: React.ReactElement;
}

export type IconBaseProps =
  Pick<EntityOptions, 'isLoading' | 'noIcon' | 'variant' | 'chain'> &
  EntityIconExtras &
  (ImageProps | SpriteIconProps | IconElementProps);

const Icon = (props: IconBaseProps) => {
  const options = useEntityOptions();
  const [ css, rest ] = useSplitCssProps(props);
  const {
    isLoading = options.isLoading,
    noIcon = options.noIcon,
    variant = options.variant,
    shield,
    hint,
    hintPostfix,
    tooltipInteractive,
    size,
    marginRightShield,
    chain,
    ...element
  } = rest;

  if (noIcon) {
    return null;
  }

  const preset = getVariantPreset(variant);
  const { mr, marginRight, ...iconCss } = css;

  const layout = {
    marginRight: shield ? marginRightShield ?? preset.icon.marginRightShield : marginRight ?? mr ?? preset.icon.marginRight,
    boxSize: preset.icon.boxSize,
    borderRadius: 'base',
    flexShrink: 0,
    minW: 0,
  };

  const iconElement = (() => {
    if (isLoading) {
      return <Skeleton loading { ...layout } { ...iconCss }/>;
    }

    if ('src' in element) {
      return <Image { ...layout } { ...iconCss } { ...element }/>;
    }

    if ('name' in element) {
      return <SpriteIcon display="block" color="icon.primary" { ...layout } { ...iconCss } { ...element }/>;
    }

    return element.children;
  })();

  const content = (
    <Box position="relative" display="inline-flex" alignItems="center" flexShrink={ 0 }>
      { iconElement }
      { shield && <IconShield isLoading={ isLoading } variant={ variant } { ...shield }/> }
    </Box>
  );

  if (!hint) {
    return content;
  }

  return (
    <Tooltip
      content={ hint }
      interactive={ tooltipInteractive }
      positioning={ shield ? { offset: { mainAxis: 8 } } : undefined }
    >
      { content }
    </Tooltip>
  );
};

type IconShieldProps = (ImageProps | SpriteIconProps) & { isLoading?: boolean; variant?: Variant };

const IconShield = (props: IconShieldProps) => {
  const options = useEntityOptions();
  const { variant = options.variant, ...rest } = props;
  const preset = getVariantPreset(variant);

  const styles = {
    position: 'absolute',
    ...preset.shield,
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

  const svgProps = rest as SpriteIconProps;

  return <SpriteIcon { ...styles } { ...svgProps }/>;
};

export interface ContentBaseProps extends
  JsxStyleProps,
  Pick<EntityOptions, 'isLoading' | 'truncation' | 'noTooltip' | 'variant' | 'noLink'> {
  className?: string;
  asProp?: React.ElementType;
  text: string;
  tooltipInteractive?: boolean;
  tooltipContentAfter?: React.ReactNode;
}

const CONSTANT_LONG_MAX_SYMBOLS = 16;

const Content = (props: ContentBaseProps) => {
  const options = useEntityOptions();
  const [ css, rest ] = useSplitCssProps(props);
  const {
    className,
    isLoading = options.isLoading,
    asProp,
    text,
    truncation = options.truncation ?? 'dynamic',
    variant = options.variant,
    noTooltip = options.noTooltip,
    tooltipInteractive,
    tooltipContentAfter,
    noLink = options.noLink,
  } = rest;

  const styles = { ...getVariantPreset(variant).content, ...css };
  const { type: truncationType, tailLength, maxSymbols } = toTruncationSpec(truncation);

  const tooltip = React.useMemo((): false | TruncateTooltipConfig => {
    if (noTooltip) {
      return false;
    }
    const content = tooltipContentAfter ? (
      <>
        { text }
        { tooltipContentAfter }
      </>
    ) : undefined;
    // `tooltipContentAfter` carries actionable UI (e.g. the advanced-filter link), so the tooltip
    // must stay reachable even when the value itself is not truncated.
    return { content, interactive: tooltipInteractive, always: Boolean(tooltipContentAfter) };
  }, [ noTooltip, tooltipContentAfter, text, tooltipInteractive ]);

  if (truncationType === 'tail') {
    return (
      <Truncate
        value={ text }
        type="end"
        loading={ isLoading }
        className={ className }
        tooltip={ tooltip }
        { ...styles }
      />
    );
  }

  const children = (() => {
    switch (truncationType) {
      case 'constant_long':
        return (
          <Truncate
            value={ text }
            as={ asProp }
            type="middle-static"
            maxSymbols={ CONSTANT_LONG_MAX_SYMBOLS }
            tooltip={ tooltip }
          />
        );
      case 'constant':
        return (
          <Truncate
            value={ text }
            as={ asProp }
            type="middle-static"
            maxSymbols={ maxSymbols }
            tooltip={ tooltip }
          />
        );
      case 'dynamic':
        return (
          <Truncate
            value={ text }
            as={ asProp }
            type="middle"
            tailLength={ tailLength }
            tooltip={ tooltip }
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
      w={ !noLink ? '100%' : undefined }
      { ...styles }
    >
      { children }
    </Skeleton>
  );
};

export interface CopyBaseProps extends
  JsxStyleProps,
  Pick<CopyToClipboardProps, 'text' | 'tooltipInteractive'>,
  Pick<EntityOptions, 'isLoading' | 'noCopy' | 'noTooltip'> {
  className?: string;
}

const Copy = (props: CopyBaseProps) => {
  const options = useEntityOptions();
  const [ css, rest ] = useSplitCssProps(props);
  const {
    text,
    className,
    tooltipInteractive,
    isLoading = options.isLoading,
    noCopy = options.noCopy,
    noTooltip = options.noTooltip,
  } = rest;

  if (noCopy) {
    return null;
  }

  return (
    <CopyToClipboard
      text={ text }
      className={ className }
      isLoading={ isLoading }
      noTooltip={ noTooltip }
      tooltipInteractive={ tooltipInteractive }
      { ...css }
    />
  );
};

export {
  Container,
  Link,
  Icon,
  IconShield,
  Copy,
  Content,
};
