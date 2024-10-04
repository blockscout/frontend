import type { As } from '@chakra-ui/react';
import { Box, Flex, Skeleton, Tooltip, chakra, VStack } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import { route } from 'nextjs-routes';

import { useAddressHighlightContext } from 'lib/contexts/addressHighlight';
import * as EntityBase from 'ui/shared/entities/base/components';

import { distributeEntityProps, getIconProps } from '../base/utils';
import AddressEntityContentProxy from './AddressEntityContentProxy';
import AddressIdenticon from './AddressIdenticon';

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

type IconProps = Pick<EntityProps, 'address' | 'isSafeAddress'> & EntityBase.IconBaseProps;

const Icon = (props: IconProps) => {
  if (props.noIcon) {
    return null;
  }

  const styles = {
    ...getIconProps(props.size),
    marginRight: props.marginRight ?? 2,
  };

  if (props.isLoading) {
    return <Skeleton { ...styles } borderRadius="full" flexShrink={ 0 }/>;
  }

  if (props.address.is_contract) {
    if (props.isSafeAddress) {
      return (
        <EntityBase.Icon
          { ...props }
          name="brands/safe"
        />
      );
    }

    const isProxy = Boolean(props.address.implementations?.length);
    const isVerified = isProxy ? props.address.is_verified && props.address.implementations?.every(({ name }) => Boolean(name)) : props.address.is_verified;
    const contractIconName: EntityBase.IconBaseProps['name'] = props.address.is_verified ? 'contracts/verified' : 'contracts/regular';
    const label = (isVerified ? 'verified ' : '') + (isProxy ? 'proxy contract' : 'contract');

    return (
      <Tooltip label={ label.slice(0, 1).toUpperCase() + label.slice(1) }>
        <span>
          <EntityBase.Icon
            { ...props }
            name={ isProxy ? 'contracts/proxy' : contractIconName }
            color={ isVerified ? 'green.500' : undefined }
            borderRadius={ 0 }
          />
        </span>
      </Tooltip>
    );
  }

  return (
    <Flex marginRight={ styles.marginRight }>
      <AddressIdenticon
        size={ props.size === 'lg' ? 30 : 20 }
        hash={ props.address.hash }
      />
    </Flex>
  );
};

export type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'address'>;

const Content = chakra((props: ContentProps) => {
  const nameTag = props.address.metadata?.tags.find(tag => tag.tagType === 'name')?.name;
  const nameText = nameTag || props.address.ens_domain_name || props.address.name;

  const isProxy = props.address.implementations && props.address.implementations.length > 0;

  if (isProxy) {
    return <AddressEntityContentProxy { ...props }/>;
  }

  if (nameText) {
    const label = (
      <VStack gap={ 0 } py={ 1 } color="inherit">
        <Box fontWeight={ 600 } whiteSpace="pre-wrap" wordBreak="break-word">{ nameText }</Box>
        <Box whiteSpace="pre-wrap" wordBreak="break-word">{ props.address.hash }</Box>
      </VStack>
    );

    return (
      <Tooltip label={ label } maxW={{ base: 'calc(100vw - 8px)', lg: '400px' }}>
        <Skeleton isLoaded={ !props.isLoading } overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" as="span">
          { nameText }
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

interface AddressProp extends Partial<AddressParam> {
  hash: string;
}

export interface EntityProps extends EntityBase.EntityBaseProps {
  address: AddressProp;
  isSafeAddress?: boolean;
  noHighlight?: boolean;
}

const AddressEntry = (props: EntityProps) => {
  const partsProps = distributeEntityProps(props);
  const context = useAddressHighlightContext(props.noHighlight);

  return (
    <Container
      // we have to use the global classnames here, see theme/global.ts
      // otherwise, if we use sx prop, Chakra will generate the same styles for each instance of the component on the page
      className={ `${ props.className } address-entity ${ props.noCopy ? 'address-entity_no-copy' : '' }` }
      data-hash={ context && !props.isLoading ? props.address.hash : undefined }
      onMouseEnter={ context?.onMouseEnter }
      onMouseLeave={ context?.onMouseLeave }
      position="relative"
      zIndex={ 0 }
    >
      <Icon { ...partsProps.icon }/>
      <Link { ...partsProps.link }>
        <Content { ...partsProps.content }/>
      </Link>
      <Copy { ...partsProps.copy }/>
    </Container>
  );
};

export default React.memo(chakra<As, EntityProps>(AddressEntry));

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
