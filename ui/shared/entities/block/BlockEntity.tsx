import type { As } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import blockIcon from 'icons/block_slim.svg';
import * as EntityBase from 'ui/shared/entities/base/components';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'hash' | 'number'>;

const Link = chakra((props: LinkProps) => {
  const heightOrHash = props.hash ?? String(props.number);
  const defaultHref = route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type IconProps = Omit<EntityBase.IconBaseProps, 'asProp'> & {
  asProp?: As;
};

const Icon = (props: IconProps) => {
  return (
    <EntityBase.Icon
      { ...props }
      asProp={ props.asProp ?? blockIcon }
    />
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'number'>;

const Content = chakra((props: ContentProps) => {
  return (
    <EntityBase.Content
      { ...props }
      text={ String(props.number) }
      tailLength={ props.tailLength ?? 2 }
    />
  );
});

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  number: number;
  hash?: string;
}

const BlockEntity = (props: EntityProps) => {
  const linkProps = _omit(props, [ 'className' ]);
  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  return (
    <Container className={ props.className }>
      <Icon { ...partsProps }/>
      <Link { ...linkProps }>
        <Content { ...partsProps }/>
      </Link>
    </Container>
  );
};

export default React.memo(chakra(BlockEntity));

export {
  Container,
  Link,
  Icon,
  Content,
};
