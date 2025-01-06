import type { As } from '@chakra-ui/react';
import { Box, chakra, Flex, Image, PopoverBody, PopoverContent, PopoverTrigger, Portal, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import { route } from 'nextjs-routes';

import Popover from 'ui/shared/chakra/Popover';
import * as EntityBase from 'ui/shared/entities/base/components';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';
import TruncatedValue from 'ui/shared/TruncatedValue';

import { distributeEntityProps, getIconProps } from '../base/utils';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'domain'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/name-domains/[name]', query: { name: props.domain } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type IconProps = Pick<EntityProps, 'protocol'> & EntityBase.IconBaseProps;

const Icon = (props: IconProps) => {
  const icon = <EntityBase.Icon { ...props } name={ props.name ?? 'ENS_slim' }/>;

  if (props.protocol) {
    const styles = getIconProps(props.size);

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

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'domain'>;

const Content = chakra((props: ContentProps) => {
  return (
    <TruncatedValue
      isLoading={ props.isLoading }
      value={ props.domain }
    />
  );
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'domain'>;

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ props.domain }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  domain: string;
  protocol?: bens.ProtocolInfo | null;
}

const EnsEntity = (props: EntityProps) => {
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

export default React.memo(chakra<As, EntityProps>(EnsEntity));

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
