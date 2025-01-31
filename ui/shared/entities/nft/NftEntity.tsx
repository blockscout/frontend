import type { As } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import * as EntityBase from 'ui/shared/entities/base/components';
import TruncatedValue from 'ui/shared/TruncatedValue';

import { distributeEntityProps } from '../base/utils';

const Container = EntityBase.Container;

const Icon = (props: EntityBase.IconBaseProps) => {
  if (props.noIcon) {
    return null;
  }

  return (
    <EntityBase.Icon
      { ...props }
      size={ props.size ?? 'lg' }
      name={ props.name ?? 'nft_shield' }
    />
  );
};

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'hash' | 'id'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/token/[hash]/instance/[id]', query: { hash: props.hash, id: props.id } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'id'>;

const Content = chakra((props: ContentProps) => {
  return (
    <TruncatedValue
      isLoading={ props.isLoading }
      value={ props.id }
    />
  );
});

export interface EntityProps extends EntityBase.EntityBaseProps {
  hash: string;
  id: string;
}

const NftEntity = (props: EntityProps) => {
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

export default React.memo(chakra<As, EntityProps>(NftEntity));

export {
  Container,
  Link,
  Icon,
  Content,
};
