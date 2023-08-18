import type { As } from '@chakra-ui/react';
import { Box, chakra, Skeleton } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import blockIcon from 'icons/block.svg';
import IconBase from 'ui/shared/chakra/Icon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/LinkInternal';

import type { Size } from './utils';
import { getPropsForSize } from './utils';

// TODO @tom2drum migrate all block links to this component
// TODO @tom2drum icon color: grey for search result page

interface LinkProps {
  className?: string;
  isLoading?: boolean;
  number: number;
  hash?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Link = chakra(({ number, hash, className, isLoading, children, onClick }: LinkProps) => {
  return (
    <LinkInternal
      className={ className }
      href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: hash || String(number) } }) }
      display="flex"
      alignItems="center"
      minWidth={ 0 } // for content truncation - https://css-tricks.com/flexbox-truncated-text/
      isLoading={ isLoading }
      onClick={ onClick }
    >
      { children }
    </LinkInternal>
  );
});

interface IconProps {
  isLoading?: boolean;
  size?: Size;
}

const Icon = ({ isLoading, size }: IconProps) => {
  const boxSize = getPropsForSize(size).icon.boxSize;
  return (
    <Box mr={ 2 }>
      <IconBase as={ blockIcon } boxSize={ boxSize } isLoading={ isLoading } borderRadius="base"/>
    </Box>
  );
};

interface ContentProps {
  className?: string;
  isLoading?: boolean;
  number: number;
  tailLength?: number;
  size?: Size;
  asProp?: As;
}

const Content = chakra(({ className, isLoading, number, tailLength, size, asProp }: ContentProps) => {
  const styles = getPropsForSize(size).content;

  return (
    <Skeleton
      className={ className }
      isLoaded={ !isLoading }
      overflow="hidden"
      whiteSpace="nowrap"
      fontSize={ styles.fontSize }
      lineHeight={ styles.lineHeight }
      fontWeight={ styles.fontWeight }
    >
      <HashStringShortenDynamic
        hash={ String(number) }
        fontWeight={ styles.fontWeight }
        tailLength={ tailLength ?? 2 }
        as={ asProp }
      />
    </Skeleton>
  );
});

interface EntryProps {
  className?: string;
  isLoading?: boolean;
  number: number;
  hash?: string;
  size?: Size;
  tailLength?: number;
}

const BlockEntity = (props: EntryProps) => {
  const partsProps = _omit(props, 'className');

  return (
    <Link { ...props }>
      <Icon { ...partsProps }/>
      <Content { ...partsProps }/>
    </Link>
  );
};

export default React.memo(chakra(BlockEntity));

export {
  Link,
  Icon,
  Content,
};
