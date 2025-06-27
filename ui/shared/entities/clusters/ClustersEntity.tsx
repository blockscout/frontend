import { Box, chakra, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Image } from 'toolkit/chakra/image';
import { Link as LinkToolkit } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import * as EntityBase from 'ui/shared/entities/base/components';
import IconSvg from 'ui/shared/IconSvg';

import { distributeEntityProps, getIconProps } from '../base/utils';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'clusterName'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/clusters/[name]', query: { name: encodeURIComponent(props.clusterName) } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type IconProps = EntityBase.IconBaseProps & Pick<EntityProps, 'clusterName'>;

const Icon = (props: IconProps) => {
  if (props.noIcon) {
    return null;
  }

  const styles = getIconProps(props.variant);

  if (props.isLoading) {
    return <Skeleton loading boxSize={ styles.boxSize } borderRadius="6px" mr={ 2 }/>;
  }

  const fallbackElement = (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width={ styles.boxSize }
      height={ styles.boxSize }
      backgroundColor="#de6061"
      borderRadius="6px"
      mr={ 2 }
      flexShrink={ 0 }
    >
      <IconSvg
        name="clusters"
        boxSize={ 6 }
        color="white"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
    </Box>
  );

  const profileImageElement = (
    <Image
      width={ styles.boxSize }
      height={ styles.boxSize }
      borderRadius="6px"
      mr={ 2 }
      flexShrink={ 0 }
      src={ `${ (config.features.clusters as { cdnUrl?: string })?.cdnUrl || '' }/profile-image/${ props.clusterName }` }
      alt={ `${ props.clusterName } profile` }
      fallback={ fallbackElement }
    />
  );

  const tooltipContent = (
    <>
      <Flex alignItems="center" textStyle="md">
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          boxSize={ 5 }
          backgroundColor="#de6061"
          borderRadius="4px"
          mr={ 2 }
        >
          <IconSvg name="clusters" boxSize={ 4 } color="white" style={{ filter: 'brightness(0) invert(1)' }}/>
        </Box>
        <div>
          <span>Clusters</span>
          <chakra.span color="text.secondary" whiteSpace="pre"> - Universal name service</chakra.span>
        </div>
      </Flex>
      <Text>
        Clusters provides unified naming across multiple blockchains including EVM, Solana, Bitcoin, and more.
        Manage all your wallet addresses under one human-readable name.
      </Text>
      <LinkToolkit
        href="https://clusters.xyz"
        display="inline-flex"
        alignItems="center"
        external
      >
        <IconSvg name="link" boxSize={ 5 } color="text.secondary" mr={ 2 }/>
        <span>Learn more about Clusters</span>
      </LinkToolkit>
    </>
  );

  return (
    <Tooltip
      content={ tooltipContent }
      variant="popover"
      positioning={{
        placement: 'bottom-start',
      }}
      contentProps={{
        maxW: { base: '100vw', lg: '440px' },
        minW: '250px',
        w: 'fit-content',
        display: 'flex',
        flexDir: 'column',
        rowGap: 3,
        alignItems: 'flex-start',
      }}
      interactive
    >
      { profileImageElement }
    </Tooltip>
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'clusterName'>;

const Content = chakra((props: ContentProps) => {
  return (
    <EntityBase.Content
      { ...props }
      text={ `${ props.clusterName }/` }
      truncation="tail"
    />
  );
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'clusterName'>;

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ props.clusterName }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  clusterName: string;
}

const ClustersEntity = (props: EntityProps) => {
  const partsProps = distributeEntityProps(props);
  const content = <Content { ...partsProps.content }/>;

  return (
    <Container { ...partsProps.container }>
      <Icon { ...partsProps.icon }/>
      { props.noLink ? content : <Link { ...partsProps.link }>{ content }</Link> }
      <Copy { ...partsProps.copy }/>
    </Container>
  );
};

export default React.memo(chakra(ClustersEntity));

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
