import type { As } from '@chakra-ui/react';
import { Flex, Skeleton, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { Pool } from 'types/api/pools';

import { route } from 'nextjs-routes';

import { getPoolTitle } from 'lib/pools/getPoolTitle';
import * as EntityBase from 'ui/shared/entities/base/components';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

import { distributeEntityProps } from '../base/utils';
import * as TokenEntity from '../token/TokenEntity';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'pool'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/pools/[hash]', query: { hash: props.pool.contract_address } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type IconProps = Pick<EntityProps, 'pool' | 'className'> & EntityBase.IconBaseProps;

const Icon = (props: IconProps) => {
  const bgColor = useColorModeValue('white', 'black');
  const borderColor = useColorModeValue('whiteAlpha.800', 'blackAlpha.800');
  return (
    <Flex>
      <Flex
        bgColor={ bgColor }
        borderRadius="full"
        border="1px solid"
        borderColor={ borderColor }
      >
        <TokenEntity.Icon
          marginRight={ 0 }
          size={ props.size }
          token={{
            icon_url: props.pool.base_token_icon_url,
            symbol: props.pool.base_token_symbol,
            address: props.pool.base_token_address,
            name: '',
            type: 'ERC-20',
          }}
          isLoading={ props.isLoading }
        />
      </Flex>
      <Flex
        transform="translateX(-8px)"
        bgColor={ bgColor }
        borderRadius="full"
        border="1px solid"
        borderColor={ borderColor }
      >
        <TokenEntity.Icon
          marginRight={ 0 }
          size={ props.size }
          token={{
            icon_url: props.pool.quote_token_icon_url,
            symbol: props.pool.quote_token_symbol,
            address: props.pool.quote_token_address,
            name: '',
            type: 'ERC-20',
          }}
          isLoading={ props.isLoading }
        />
      </Flex>
    </Flex>
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'pool'>;

const Content = chakra((props: ContentProps) => {
  const nameString = getPoolTitle(props.pool);

  return (
    <TruncatedTextTooltip label={ nameString }>
      <Skeleton
        isLoaded={ !props.isLoading }
        display="inline-block"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        height="fit-content"
      >
        { nameString }
      </Skeleton>
    </TruncatedTextTooltip>
  );
});

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  pool: Pool;
}

const PoolEntity = (props: EntityProps) => {
  const partsProps = distributeEntityProps(props);

  return (
    <Container w="100%" { ...partsProps.container }>
      <Icon { ...partsProps.icon }/>
      <Link { ...partsProps.link }>
        <Content { ...partsProps.content }/>
      </Link>
    </Container>
  );
};

export default React.memo(chakra<As, EntityProps>(PoolEntity));

export {
  Container,
  Link,
  Icon,
  Content,
};
