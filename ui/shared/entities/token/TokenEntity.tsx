import type { As } from '@chakra-ui/react';
import { Image, Skeleton, chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import { route } from 'nextjs-routes';

import * as EntityBase from 'ui/shared/entities/base/components';
import TokenLogoPlaceholder from 'ui/shared/TokenLogoPlaceholder';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

import { getIconProps } from '../base/utils';

interface LinkProps extends Pick<EntityProps, 'className' | 'token' | 'onClick' | 'isLoading' | 'isExternal' | 'href' | 'query'> {
  children: React.ReactNode;
}

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/token/[hash]', query: { ...props.query, hash: props.token.address } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type IconProps = Pick<EntityProps, 'token' | 'isLoading' | 'iconSize' | 'noIcon'> & {
  asProp?: As;
};

const Icon = (props: IconProps) => {
  if (props.noIcon) {
    return null;
  }

  const styles = {
    ...getIconProps(props.iconSize),
    marginRight: 2,
    borderRadius: 'base',
  };

  if (props.isLoading) {
    return <Skeleton { ...styles } flexShrink={ 0 }/>;
  }

  return (
    <Image
      { ...styles }
      src={ props.token.icon_url ?? undefined }
      alt={ `${ props.token.name || 'token' } logo` }
      fallback={ <TokenLogoPlaceholder { ...styles }/> }
    />
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'token'>;

const Content = chakra((props: ContentProps) => {
  const name = props.token.name ?? 'Unnamed token';

  return (
    <TruncatedTextTooltip label={ name }>
      <Skeleton
        isLoaded={ !props.isLoading }
        display="inline-block"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        height="fit-content"
      >
        { name }
      </Skeleton>
    </TruncatedTextTooltip>
  );
});

type SymbolProps = Pick<EntityProps, 'token' | 'isLoading' | 'noSymbol'>;

const Symbol = (props: SymbolProps) => {
  const symbol = props.token.symbol;

  if (!symbol || props.noSymbol) {
    return null;
  }

  return (
    <Skeleton
      isLoaded={ !props.isLoading }
      display="inline-flex"
      alignItems="center"
      maxW="20%"
      ml={ 2 }
      color="text_secondary"
    >
      <div>(</div>
      <TruncatedTextTooltip label={ symbol }>
        <chakra.span
          display="inline-block"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          height="fit-content"
        >
          { symbol }
        </chakra.span>
      </TruncatedTextTooltip>
      <div>)</div>
    </Skeleton>
  );
};

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'token'>;

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ props.token.address }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  token: Pick<TokenInfo, 'address' | 'icon_url' | 'name' | 'symbol'>;
  noSymbol?: boolean;
}

const TokenEntity = (props: EntityProps) => {
  const linkProps = _omit(props, [ 'className' ]);
  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  return (
    <Container className={ props.className } w="100%">
      <Icon { ...partsProps }/>
      <Link { ...linkProps }>
        <Content { ...partsProps }/>
      </Link>
      <Symbol { ...partsProps }/>
      <Copy { ...partsProps }/>
    </Container>
  );
};

export default React.memo(chakra(TokenEntity));

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
