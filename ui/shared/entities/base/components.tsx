import { Box, chakra, Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { As, IconProps } from '@chakra-ui/react';
import React from 'react';

import IconBase from 'ui/shared/chakra/Icon';
import type { Props as CopyToClipboardProps } from 'ui/shared/CopyToClipboard';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

import { getIconProps, type IconSize } from './utils';

export type Truncation = 'constant' | 'dynamic' | 'tail' | 'none';

// TODO @tom2drum add disabled link props
export interface EntityBaseProps {
  className?: string;
  isLoading?: boolean;
  iconSize?: IconSize;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  isExternal?: boolean;
  href?: string;
  query?: Record<string, string>;
  noIcon?: boolean;
  noCopy?: boolean;
  tailLength?: number;
  truncation?: Truncation;
}

export interface ContainerBaseProps extends Pick<EntityBaseProps, 'className'> {
  children: React.ReactNode;
}

const Container = chakra(({ className, children }: ContainerBaseProps) => {
  return (
    <Flex
      className={ className }
      alignItems="center"
      minWidth={ 0 } // for content truncation - https://css-tricks.com/flexbox-truncated-text/
    >
      { children }
    </Flex>
  );
});

export interface LinkBaseProps extends Pick<EntityBaseProps, 'className' | 'onClick' | 'isLoading' | 'isExternal' | 'href'> {
  children: React.ReactNode;
}

const Link = chakra(({ isLoading, children, isExternal, onClick, href }: LinkBaseProps) => {
  const Component = isExternal ? LinkExternal : LinkInternal;

  return (
    <Component
      href={ href }
      isLoading={ isLoading }
      onClick={ onClick }
      display="inline-flex"
      alignItems="center"
      minWidth={ 0 } // for content truncation - https://css-tricks.com/flexbox-truncated-text/
    >
      { children }
    </Component>
  );
});

export interface IconBaseProps extends Pick<EntityBaseProps, 'isLoading' | 'iconSize' | 'noIcon'> {
  asProp: As;
  color?: IconProps['color'];
}

const Icon = ({ isLoading, iconSize, noIcon, asProp, color }: IconBaseProps) => {
  const defaultColor = useColorModeValue('gray.500', 'gray.400');

  if (noIcon) {
    return null;
  }

  const styles = getIconProps(iconSize);
  return (
    <Box mr={ 2 } color={ color ?? defaultColor }>
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
