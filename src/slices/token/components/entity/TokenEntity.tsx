// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from '../../types/api';
import type { schemas } from '@blockscout/api-types';

import TokenIconPlaceholder from 'src/slices/token/components/icon/TokenIconPlaceholder';

import config from 'src/config';
import type { EntityComponentProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf } from 'src/shared/entities/entity-props';
import { useEntityRoot } from 'src/shared/entities/root';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

export interface TokenEntityData {
  token: Pick<schemas['Token'], 'address_hash' | 'icon_url' | 'name' | 'symbol' | 'reputation'> & {
    type: TokenType | null;
  };
  noSymbol?: boolean;
  jointSymbol?: boolean;
  onlySymbol?: boolean;
}

export type EntityProps = EntityComponentProps<TokenEntityData>;

const UNNAMED_TOKEN = 'Unnamed token';

const getTokenText = ({ token, jointSymbol, onlySymbol }: TokenEntityData): string => {
  return [
    !onlySymbol && (token?.name ?? UNNAMED_TOKEN),
    onlySymbol && (token?.symbol ?? token?.name ?? UNNAMED_TOKEN),
    token?.symbol && jointSymbol && !onlySymbol && `(${ token.symbol })`,
  ].filter(Boolean).join(' ');
};

const TokenEntityBase = defineEntity<TokenEntityData>({
  name: 'TokenEntity',
  data: keysOf<TokenEntityData>()([ 'token', 'noSymbol', 'jointSymbol', 'onlySymbol' ]),
  route: ({ token }) => token ? { pathname: '/token/[hash]', query: { hash: token.address_hash } } : undefined,
  routeTemplate: 'token',
  hintPrefix: 'Token on ',
  icon: ({ token }) => ({
    src: token?.icon_url ?? undefined,
    alt: `${ token?.name || 'token' } logo`,
    fallback: <TokenIconPlaceholder/>,
    borderRadius: token?.type === 'ERC-20' ? 'full' : 'base',
  }),
  text: getTokenText,
  copyText: ({ token }) => token?.address_hash ?? '',
  defaults: { truncation: 'tail' },
});

const { Root, Container, Icon, Link, Content, Copy } = TokenEntityBase;

const Symbol = () => {
  const root = useEntityRoot<TokenEntityData>();
  const data = root?.data;
  const symbol = data?.token.symbol;

  if (!symbol || data.noSymbol || data.jointSymbol || data.onlySymbol) {
    return null;
  }

  return (
    <Skeleton
      loading={ root?.options.isLoading }
      display="inline-flex"
      alignItems="center"
      maxW="20%"
      ml={ 2 }
      color="text.secondary"
    >
      <div>(</div>
      <Truncate value={ symbol } type="end"/>
      <div>)</div>
    </Skeleton>
  );
};

interface ReputationProps extends BoxProps {
  value: schemas['Token']['reputation'];
}

const Reputation = ({ value, ...rest }: ReputationProps) => {
  if (config.slices.token.hideScamTokensEnabled && value === 'scam') {
    return (
      <Tooltip content="This token has been flagged as a potential scam. You enabled the display of flagged tokens in the explorer — proceed with caution.">
        <SpriteIcon name="scam" boxSize={ 5 } ml={ 2 } { ...rest }/>
      </Tooltip>
    );
  }

  return null;
};

const TokenEntity = (props: EntityProps) => {
  return (
    <Container w="100%" { ...props }>
      <Icon/>
      <Link><Content/></Link>
      <Symbol/>
      <Copy/>
      <Reputation value={ props.token.reputation }/>
    </Container>
  );
};

Symbol.displayName = 'TokenEntity.Symbol';
Reputation.displayName = 'TokenEntity.Reputation';
TokenEntity.displayName = 'TokenEntity';

export default React.memo(TokenEntity);

export {
  Root,
  Container,
  Link,
  Icon,
  Content,
  Copy,
  Reputation,
};
