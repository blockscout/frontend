import type { As } from '@chakra-ui/react';
import { chakra, Flex } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import transactionIcon from 'icons/transactions.svg';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as EntityBase from 'ui/shared/entities/base/components';

// TODO @tom2drum icon color: grey for search result page

interface LinkProps extends Pick<EntityProps, 'className' | 'hash' | 'onClick' | 'isLoading' | 'isExternal' | 'href'> {
  children: React.ReactNode;
}

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/tx/[hash]', query: { hash: props.hash } });

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
      asProp={ props.asProp ?? transactionIcon }
    />
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'hash'>;

const Content = chakra((props: ContentProps) => {
  return (
    <EntityBase.Content
      { ...props }
      text={ props.hash }
    />
  );
});

const Copy = CopyToClipboard;

export interface EntityProps extends EntityBase.EntityBaseProps {
  hash: string;
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
