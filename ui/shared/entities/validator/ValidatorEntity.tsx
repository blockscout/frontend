import type { As } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import * as EntityBase from 'ui/shared/entities/base/components';

import { distributeEntityProps } from '../base/utils';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'id'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/validators/[id]', query: { id: props.id } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

const Icon = (props: EntityBase.IconBaseProps) => {
  return (
    <EntityBase.Icon
      { ...props }
      name={ props.name ?? 'key' }
    />
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'id'>;

const Content = chakra((props: ContentProps) => {
  return (
    <EntityBase.Content
      { ...props }
      text={ props.id }
    />
  );
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'id'>;

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ props.id }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  id: string;
}

const UserOpEntity = (props: EntityProps) => {
  const partsProps = distributeEntityProps(props);

  return (
    <Container { ...partsProps.container }>
      <Icon { ...partsProps.icon }/>
      <Link { ...partsProps.link }>
        <Content { ...partsProps.content }/>
      </Link>
      <Copy { ...partsProps.copy }/>
    </Container>
  );
};

export default React.memo(chakra<As, EntityProps>(UserOpEntity));

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
