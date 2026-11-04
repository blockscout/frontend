// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, chakra, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import config from 'src/config';
import type { EntityComponentProps, EntityIconProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf, mergeEntityData, mergeIconOptions, splitByKeys } from 'src/shared/entities/entity-props';
import { useEntityOptions, useEntityRoot } from 'src/shared/entities/root';
import { useSplitCssProps } from 'src/shared/entities/split-css-props';
import { getVariantPreset } from 'src/shared/entities/variants';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Image } from 'src/toolkit/chakra/image';
import { Link as LinkToolkit } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

const nameServicesFeature = config.features.nameServices;
const clustersFeature = nameServicesFeature.isEnabled && nameServicesFeature.clusters.isEnabled ? nameServicesFeature.clusters : undefined;

export interface ClustersEntityData {
  clusterName: string;
}

export type EntityProps = EntityComponentProps<ClustersEntityData>;
export type IconProps = EntityIconProps<ClustersEntityData>;

const DATA_KEYS = keysOf<ClustersEntityData>()([ 'clusterName' ]);

const getDisplayName = ({ clusterName }: ClustersEntityData): string => {
  if (!clusterName) {
    return '';
  }

  return clusterName.includes('/') ? clusterName : `${ clusterName }/`;
};

const ClustersEntityBase = defineEntity<ClustersEntityData>({
  name: 'ClustersEntity',
  data: DATA_KEYS,
  route: ({ clusterName }) => clusterName ?
    { pathname: '/name-services/clusters/[name]', query: { name: encodeURIComponent(clusterName) } } :
    undefined,
  singleChain: true,
  hintPrefix: 'Cluster on ',
  icon: 'clusters',
  text: getDisplayName,
  copyText: ({ clusterName }) => clusterName,
  defaults: { truncation: 'tail' },
});

const { Root, Container, Link, Content, Copy } = ClustersEntityBase;

const tooltipContent = (
  <>
    <Flex alignItems="center" textStyle="md">
      <Box
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        boxSize={ 5 }
        backgroundColor="clusters"
        borderRadius="sm"
        mr={ 2 }
      >
        <SpriteIcon name="clusters" boxSize={ 4 } color="white" style={{ filter: 'brightness(0) invert(1)' }}/>
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
      <SpriteIcon name="link" boxSize={ 5 } color="text.secondary" mr={ 2 }/>
      <span>Learn more about Clusters</span>
    </LinkToolkit>
  </>
);

const Icon = (props: IconProps) => {
  const root = useEntityRoot<ClustersEntityData>();
  const options = useEntityOptions();
  const [ css, rest ] = useSplitCssProps(props);
  const [ override, own ] = splitByKeys<ClustersEntityData, Pick<IconProps, 'isLoading' | 'noIcon' | 'variant' | 'className'>>(rest, DATA_KEYS);
  const { clusterName } = mergeEntityData(root?.data, override);
  const icon = mergeIconOptions(options.icon, own);
  const { isLoading = options.isLoading, noIcon = options.noIcon, variant = options.variant } = icon;

  if (noIcon) {
    return null;
  }

  const preset = getVariantPreset(variant).icon;
  const layout = {
    boxSize: icon.boxSize ?? preset.boxSize,
    marginRight: icon.marginRight ?? icon.mr ?? preset.marginRight,
    ...css,
  };

  if (isLoading) {
    return <Skeleton loading borderRadius="base" { ...layout }/>;
  }

  const fallbackElement = (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      className={ own.className }
      backgroundColor="clusters"
      borderRadius="base"
      flexShrink={ 0 }
      { ...layout }
    >
      <SpriteIcon
        name="clusters"
        width="100%"
        height="100%"
        color="white"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
    </Box>
  );

  return (
    <Tooltip
      content={ tooltipContent }
      variant="popover"
      positioning={{
        placement: 'bottom-start',
      }}
      contentProps={{
        maxW: { base: 'calc(100vw - 8px)', lg: '440px' },
        minW: '250px',
        w: 'fit-content',
        display: 'flex',
        flexDir: 'column',
        rowGap: 3,
        alignItems: 'flex-start',
      }}
      interactive
    >
      <Image
        className={ own.className }
        borderRadius="base"
        flexShrink={ 0 }
        { ...layout }
        src={ `${ clustersFeature?.cdnUrl || '' }/profile-image/${ clusterName }` }
        alt={ `${ clusterName } profile` }
        fallback={ fallbackElement }
      />
    </Tooltip>
  );
};

const ClustersEntity = (props: EntityProps) => {
  return (
    <Container { ...props }>
      <Icon/>
      <Link><Content/></Link>
      <Copy/>
    </Container>
  );
};

Icon.displayName = 'ClustersEntity.Icon';
ClustersEntity.displayName = 'ClustersEntity';

export default React.memo(ClustersEntity);

export {
  Root,
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
