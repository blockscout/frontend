import { Box, chakra, Flex, Image, Popover, PopoverBody, PopoverContent, PopoverTrigger, Portal, Skeleton, Text } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import { route } from 'nextjs-routes';

import * as EntityBase from 'ui/shared/entities/base/components';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';
import TruncatedValue from 'ui/shared/TruncatedValue';

import { getIconProps } from '../base/utils';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'name'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/name-domains/[name]', query: { name: props.name } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type IconProps = Omit<EntityBase.IconBaseProps, 'name'> & Pick<EntityProps, 'protocol'> & {
  iconName?: EntityBase.IconBaseProps['name'];
};

const Icon = (props: IconProps) => {
  const icon = <EntityBase.Icon { ...props } name={ props.iconName ?? 'ENS_slim' }/>;

  if (props.protocol) {
    const styles = getIconProps(props.iconSize);

    if (props.isLoading) {
      return <Skeleton boxSize={ styles.boxSize } borderRadius="sm" mr={ 2 }/>;
    }

    return (
      <Popover trigger="hover" isLazy placement="bottom-start">
        <PopoverTrigger>
          <Box flexShrink={ 0 }>
            <Image
              src={ props.protocol.icon_url }
              boxSize={ styles.boxSize }
              borderRadius="sm"
              mr={ 2 }
              alt={ `${ props.protocol.title } protocol icon` }
              fallback={ icon }
              fallbackStrategy={ props.protocol.icon_url ? 'onError' : 'beforeLoadOrError' }
            />
          </Box>
        </PopoverTrigger>
        <Portal>
          <PopoverContent maxW={{ base: '100vw', lg: '440px' }} minW="250px" w="fit-content">
            <PopoverBody display="flex" flexDir="column" rowGap={ 3 }>
              <Flex alignItems="center">
                <Image
                  src={ props.protocol.icon_url }
                  boxSize={ 5 }
                  borderRadius="sm"
                  mr={ 2 }
                  alt={ `${ props.protocol.title } protocol icon` }
                  fallback={ icon }
                  fallbackStrategy={ props.protocol.icon_url ? 'onError' : 'beforeLoadOrError' }
                />
                <div>
                  <span>{ props.protocol.short_name }</span>
                  <chakra.span color="text_secondary" whiteSpace="pre"> { props.protocol.tld_list.map((tld) => `.${ tld }`).join((' ')) }</chakra.span>
                </div>
              </Flex>
              <Text fontSize="sm">{ props.protocol.description }</Text>
              { props.protocol.docs_url && (
                <LinkExternal
                  href={ props.protocol.docs_url }
                  display="inline-flex"
                  alignItems="center"
                  fontSize="sm"
                >
                  <IconSvg name="docs" boxSize={ 5 } color="text_secondary" mr={ 2 }/>
                  <span>Documentation</span>
                </LinkExternal>
              ) }
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    );
  }

  return icon;
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'name'>;

const Content = chakra((props: ContentProps) => {
  return (
    <TruncatedValue
      isLoading={ props.isLoading }
      value={ props.name }
    />
  );
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'name'>;

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ props.name }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  name: string;
  protocol?: bens.ProtocolInfo | null;
}

const EnsEntity = (props: EntityProps) => {
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

export default React.memo(chakra(EnsEntity));

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
