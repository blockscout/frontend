import type { As } from '@chakra-ui/react';
import { Flex, Skeleton, Tooltip, chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import type { AddressParam } from 'types/api/addressParams';

import { route } from 'nextjs-routes';

import iconContractVerified from 'icons/contract_verified.svg';
import iconContract from 'icons/contract.svg';
import * as EntityBase from 'ui/shared/entities/base/components';

import { getIconProps } from '../base/utils';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'address'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/address/[hash]', query: { ...props.query, hash: props.address.hash } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type IconProps = Pick<EntityProps, 'address' | 'isLoading' | 'iconSize' | 'noIcon'> & {
  asProp?: As;
};

const Icon = (props: IconProps) => {
  if (props.noIcon) {
    return null;
  }

  const styles = {
    ...getIconProps(props.iconSize),
    marginRight: 2,
  };

  if (props.isLoading) {
    return <Skeleton { ...styles } borderRadius="full" flexShrink={ 0 }/>;
  }

  if (props.address.is_contract) {
    if (props.address.is_verified) {
      return (
        <Tooltip label="Verified contract">
          <span>
            <EntityBase.Icon
              { ...props }
              asProp={ iconContractVerified }
              color="green.500"
              borderRadius={ 0 }
            />
          </span>
        </Tooltip>
      );
    }

    return (
      <Tooltip label="Contract">
        <span>
          <EntityBase.Icon
            { ...props }
            asProp={ iconContract }
            borderRadius={ 0 }
          />
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={ props.address.implementation_name }>
      <Flex { ...styles }>
        <Jazzicon diameter={ props.iconSize === 'lg' ? 30 : 20 } seed={ jsNumberForAddress(props.address.hash) }/>
      </Flex>
    </Tooltip>
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'address'>;

const Content = chakra((props: ContentProps) => {
  if (props.address.name) {
    return (
      <Tooltip label={ props.address.hash } maxW="100vw">
        <Skeleton isLoaded={ !props.isLoading } overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" as="span">
          { props.address.name }
        </Skeleton>
      </Tooltip>
    );
  }

  return (
    <EntityBase.Content
      { ...props }
      text={ props.address.hash }
    />
  );
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'address'>;

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ props.address.hash }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  address: Pick<AddressParam, 'hash' | 'name' | 'is_contract' | 'is_verified' | 'implementation_name'>;
}

const AddressEntry = (props: EntityProps) => {
  const linkProps = _omit(props, [ 'className' ]);
  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  return (
    <Container className={ props.className }>
      <Icon { ...partsProps }/>
      <Link { ...linkProps }>
        <Content { ...partsProps }/>
      </Link>
      <Copy { ...partsProps }/>
    </Container>
  );
};

export default React.memo(chakra(AddressEntry));

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
