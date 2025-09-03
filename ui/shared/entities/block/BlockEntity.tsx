import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs/routes';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import getChainTooltipText from 'lib/multichain/getChainTooltipText';
import getIconUrl from 'lib/multichain/getIconUrl';
import * as EntityBase from 'ui/shared/entities/base/components';

import { distributeEntityProps } from '../base/utils';

type LinkProps = EntityBase.LinkBaseProps & Partial<Pick<EntityProps, 'hash' | 'number'>>;

const Link = chakra((props: LinkProps) => {
  const heightOrHash = props.hash ?? String(props.number);
  const defaultHref = route(
    { pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash } },
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

type IconProps = EntityBase.IconBaseProps & Pick<EntityProps, 'isPendingUpdate'>;

const Icon = (props: IconProps) => {

  const isPendingUpdate = props.isPendingUpdate && config.UI.views.block.pendingUpdateAlertEnabled;

  const name = (() => {
    if ('name' in props) {
      return props.name;
    }

    return isPendingUpdate ? 'status/warning' : 'block_slim';
  })();

  const hint = (() => {
    if ('hint' in props) {
      return props.hint;
    }

    if (props.chain) {
      return getChainTooltipText(props.chain, 'Block on ');
    }

    return isPendingUpdate ? 'Block is being re-synced. Details may be incomplete until the update is finished.' : undefined;
  })();

  return (
    <EntityBase.Icon
      { ...props }
      name={ name }
      shield={ props.shield ?? (props.chain ? { src: getIconUrl(props.chain) } : undefined) }
      hint={ hint }
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
  number: number | string;
  hash?: string;
  isPendingUpdate?: boolean;
}

const BlockEntity = (props: EntityProps) => {
  const multichainContext = useMultichainContext();
  const partsProps = distributeEntityProps(props, multichainContext);

  const content = <Content { ...partsProps.content }/>;

  return (
    <Container { ...partsProps.container }>
      <Icon { ...partsProps.icon } isPendingUpdate={ props.isPendingUpdate }/>
      { props.noLink ? content : <Link { ...partsProps.link }>{ content }</Link> }
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
