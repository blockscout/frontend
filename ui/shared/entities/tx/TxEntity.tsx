import type { As } from '@chakra-ui/react';
import { Box, chakra, Flex, Skeleton } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import type { HashTruncation } from 'types/ui';

import { route } from 'nextjs-routes';

import transactionIcon from 'icons/transactions.svg';
import IconBase from 'ui/shared/chakra/Icon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

import type { Size } from '../utils';
import { getPropsForSize } from '../utils';

// TODO @tom2drum icon color: grey for search result page
// TODO @tom2drum refactor tx links and AddressLinks with type transaction
// TODO @tom2drum make EntityBase component

interface LinkProps extends Pick<EntityProps, 'className' | 'hash' | 'onClick' | 'isLoading' | 'isExternal' | 'href'> {
  children: React.ReactNode;
}

const Link = chakra(({ hash, className, isLoading, children, isExternal, onClick, href }: LinkProps) => {
  const Component = isExternal ? LinkExternal : LinkInternal;

  return (
    <Component
      className={ className }
      href={ href ?? route({ pathname: '/tx/[hash]', query: { hash } }) }
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

interface IconProps extends Pick<EntityProps, 'isLoading' | 'size' | 'noIcon'> {
  asProp?: As;
}

const Icon = ({ isLoading, size, noIcon, asProp }: IconProps) => {
  if (noIcon) {
    return null;
  }

  const styles = getPropsForSize(size).icon;
  return (
    <Box marginRight={ styles.marginRight }>
      <IconBase
        as={ asProp ?? transactionIcon }
        boxSize={ styles.boxSize }
        isLoading={ isLoading }
        borderRadius="base"
      />
    </Box>
  );
};

interface ContentProps extends Pick<EntityProps, 'className' | 'isLoading' | 'hash' | 'truncation'> {
  asProp?: As;
}

const Content = chakra(({ className, isLoading, asProp, hash, truncation = 'dynamic' }: ContentProps) => {

  const children = (() => {
    switch (truncation) {
      case 'constant':
        return (
          <HashStringShorten
            hash={ hash }
            as={ asProp }
          />
        );
      case 'dynamic':
        return (
          <HashStringShortenDynamic
            hash={ hash }
            as={ asProp }
          />
        );
      case 'none':
        return <span>{ hash }</span>;
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

export interface EntityProps {
  className?: string;
  isLoading?: boolean;
  hash: string;
  size?: Size;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  isExternal?: boolean;
  href?: string;
  noIcon?: boolean;
  truncation?: HashTruncation;
  withCopy?: boolean;
}

const TxEntity = (props: EntityProps) => {
  if (props.withCopy) {
    const partsProps = _omit(props, [ 'className', 'onClick' ]);
    const linkProps = _omit(props, [ 'className' ]);

    // TODO @tom2drum refactor if icon should be a part of the link
    return (
      <Flex alignItems="center" className={ props.className } { ...partsProps }>
        <Link { ...linkProps }>
          <Icon { ...partsProps }/>
          <Content { ...partsProps }/>
        </Link>
        <Copy text={ props.hash } isLoading={ props.isLoading }/>
      </Flex>
    );
  }

  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  return (
    <Link { ...props }>
      <Icon { ...partsProps }/>
      <Content { ...partsProps }/>
    </Link>
  );
};

export default React.memo(chakra(TxEntity));

export {
  Link,
  Icon,
  Content,
};
