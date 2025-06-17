import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs/routes';

import { useMultichainContext } from 'lib/contexts/multichain';
import * as EntityBase from 'ui/shared/entities/base/components';

import { distributeEntityProps } from '../base/utils';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'hash'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route(
    { pathname: '/tx/[hash]', query: { hash: props.hash } },
    props.chain ? { chain: props.chain } : undefined,
  );

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
      name={ props.name ?? 'transactions_slim' }
      shield={ props.shield ?? (props.chain ? {
        src: props.chain.config.UI.navigation.icon.default,
      } : undefined) }
      hint={ props.chain ? `Transaction on ${ props.chain.config.chain.name } (Chain ID: ${ props.chain.config.chain.id })` : undefined }
    />
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'hash' | 'text'>;

const Content = chakra((props: ContentProps) => {
  return (
    <EntityBase.Content
      { ...props }
      text={ props.text ?? props.hash }
    />
  );
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'hash'>;

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ props.hash }
      // by default we don't show copy icon, maybe this should be revised
      noCopy={ props.noCopy ?? true }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  hash: string;
  text?: string;
}

const TxEntity = (props: EntityProps) => {
  const multichainContext = useMultichainContext();
  const partsProps = distributeEntityProps(props);

  const chain = props.chain ?? multichainContext?.chain;
  const content = <Content { ...partsProps.content }/>;

  return (
    <Container { ...partsProps.container }>
      <Icon { ...partsProps.icon }/>
      { props.noLink ? content : <Link { ...partsProps.link } chain={ chain }>{ content }</Link> }
      <Copy { ...partsProps.copy }/>
    </Container>
  );
};

export default React.memo(chakra(TxEntity));

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
