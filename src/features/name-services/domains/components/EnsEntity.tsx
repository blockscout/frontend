// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

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
import { makePrettyLink } from 'src/toolkit/utils/url';

export interface EnsEntityData {
  domain: string;
  protocol?: bens.ProtocolInfo | null;
  protocolDapp?: {
    url?: string;
    logo?: string;
  };
}

export type EntityProps = EntityComponentProps<EnsEntityData>;
export type IconProps = EntityIconProps<EnsEntityData>;

const DATA_KEYS = keysOf<EnsEntityData>()([ 'domain', 'protocol', 'protocolDapp' ]);

const EnsEntityBase = defineEntity<EnsEntityData>({
  name: 'EnsEntity',
  data: DATA_KEYS,
  route: ({ domain, protocol }) => ({ pathname: '/name-services/domains/[name]', query: { name: domain, protocol_id: protocol?.id } }),
  singleChain: true,
  hintPrefix: 'Domain on ',
  icon: 'ENS',
  text: ({ domain }) => domain,
  copyText: ({ domain }) => domain,
  defaults: { truncation: 'tail' },
});

const { Root, Container, Link, Content, Copy } = EnsEntityBase;

interface ProtocolPopoverProps {
  protocol: bens.ProtocolInfo;
  protocolDapp: EnsEntityData['protocolDapp'];
  fallback: React.ReactElement;
}

const ProtocolPopoverContent = ({ protocol, protocolDapp, fallback }: ProtocolPopoverProps) => {
  const dappLink = makePrettyLink(protocolDapp?.url);

  return (
    <>
      <Flex alignItems="center" textStyle="md">
        <Image
          src={ protocol.icon_url }
          boxSize={ 5 }
          borderRadius="sm"
          mr={ 2 }
          alt={ `${ protocol.title } protocol icon` }
          fallback={ fallback }
        />
        <div>
          <span>{ protocol.short_name }</span>
          <chakra.span color="text.secondary" whiteSpace="pre"> { protocol.tld_list.map((tld) => `.${ tld }`).join((' ')) }</chakra.span>
        </div>
      </Flex>
      <Text>{ protocol.description }</Text>
      { (protocol.docs_url || dappLink) && (
        <Flex columnGap={ 3 } alignItems="center" flexWrap="wrap" w="100%">
          { protocol.docs_url && (
            <LinkToolkit
              href={ protocol.docs_url }
              display="inline-flex"
              alignItems="center"
              external
              flexBasis="calc((100% - 12px) / 2)"
              flexGrow={ 1 }
            >
              <SpriteIcon name="docs" boxSize={ 5 } color="icon.primary" mr={ 2 }/>
              <span>Documentation</span>
            </LinkToolkit>
          ) }
          { dappLink && (
            <LinkToolkit
              href={ dappLink.href }
              display="inline-flex"
              alignItems="center"
              external
              flexBasis="calc((100% - 12px) / 2)"
              flexGrow={ 1 }
            >
              { protocolDapp?.logo &&
                <Image src={ protocolDapp.logo } boxSize={ 5 } mr={ 2 } borderRadius="sm" alt={ `${ protocol.title } protocol dapp logo` }/> }
              <span>{ dappLink.domain }</span>
            </LinkToolkit>
          ) }
        </Flex>
      ) }
    </>
  );
};

const Icon = (props: IconProps) => {
  const root = useEntityRoot<EnsEntityData>();
  const options = useEntityOptions();
  const [ css, rest ] = useSplitCssProps(props);
  const [ override, own ] = splitByKeys<EnsEntityData, Pick<IconProps, 'isLoading' | 'noIcon' | 'variant' | 'className'>>(rest, DATA_KEYS);
  const { protocol, protocolDapp } = mergeEntityData(root?.data, override);
  const icon = mergeIconOptions(options.icon, own);
  const { isLoading = options.isLoading, noIcon = options.noIcon, variant = options.variant } = icon;

  if (!protocol) {
    return <EnsEntityBase.Icon { ...props }/>;
  }

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
    return <Skeleton loading borderRadius="sm" { ...layout }/>;
  }

  const fallback = <EnsEntityBase.Icon { ...props }/>;

  return (
    <Tooltip
      content={ <ProtocolPopoverContent protocol={ protocol } protocolDapp={ protocolDapp } fallback={ fallback }/> }
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
      <Image
        className={ own.className }
        borderRadius="sm"
        flexShrink={ 0 }
        { ...layout }
        src={ protocol.icon_url }
        alt={ `${ protocol.title } protocol icon` }
        fallback={ fallback }
      />
    </Tooltip>
  );
};

const EnsEntity = (props: EntityProps) => {
  return (
    <Container { ...props }>
      <Icon/>
      <Link><Content/></Link>
      <Copy/>
    </Container>
  );
};

ProtocolPopoverContent.displayName = 'EnsEntity.ProtocolPopoverContent';
Icon.displayName = 'EnsEntity.Icon';
EnsEntity.displayName = 'EnsEntity';

export default React.memo(EnsEntity);

export {
  Root,
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
