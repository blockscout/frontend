import { chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import * as EntityBase from 'ui/shared/entities/base/components';
import TruncatedValue from 'ui/shared/TruncatedValue';

const Container = EntityBase.Container;

type IconProps = Pick<EntityProps, 'isLoading' | 'noIcon' | 'iconSize'> & {
  name?: EntityBase.IconBaseProps['name'];
};

const Icon = (props: IconProps) => {
  if (props.noIcon) {
    return null;
  }

  return (
    <EntityBase.Icon
      { ...props }
      iconSize={ props.iconSize ?? 'lg' }
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
  const linkProps = _omit(props, [ 'className' ]);
  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  return (
    <Container className={ props.className } w="100%">
      <Icon { ...partsProps }/>
      <Link { ...linkProps }>
        <Content { ...partsProps }/>
      </Link>
    </Container>
  );
};

export default React.memo(chakra(NftEntity));

export {
  Container,
  Link,
  Icon,
  Content,
};
