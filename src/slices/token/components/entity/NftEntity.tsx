// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import type { IconBaseProps } from 'src/shared/entities/components';
import type { EntityComponentProps, EntityIconProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf, mergeEntityData, mergeIconOptions, splitByKeys } from 'src/shared/entities/entity-props';
import { useEntityOptions, useEntityRoot } from 'src/shared/entities/root';
import { useSplitCssProps } from 'src/shared/entities/split-css-props';
import { getVariantPreset } from 'src/shared/entities/variants';

import NftMedia from '../nft-media/NftMedia';

export interface NftEntityData {
  hash: string;
  id: string;
  instance?: schemas['TokenInstance'] | null;
}

export type EntityProps = EntityComponentProps<NftEntityData>;
export type IconProps = EntityIconProps<NftEntityData>;

const DATA_KEYS = keysOf<NftEntityData>()([ 'hash', 'id', 'instance' ]);

const NftEntityBase = defineEntity<NftEntityData>({
  name: 'NftEntity',
  data: DATA_KEYS,
  route: ({ hash, id }) => ({ pathname: '/token/[hash]/instance/[id]', query: { hash, id } }),
  hintPrefix: 'NFT on ',
  icon: 'nft_shield',
  text: ({ id }) => id,
  // Stryker disable next-line BooleanLiteral: `true` is not a `copyText` value; the compiler rejects it, and the literal is read once at module load
  copyText: false,
  defaults: { truncation: 'tail' },
});

const { Root, Container, Link, Content, Copy } = NftEntityBase;

const ICON_MEDIA_TYPES = [ 'image' as const ];

const Icon = (props: IconProps) => {
  const root = useEntityRoot<NftEntityData>();
  const options = useEntityOptions();
  const [ override, own ] = splitByKeys<NftEntityData, object>(props, DATA_KEYS);
  const data = mergeEntityData(root?.data, override);
  const icon: IconBaseProps = mergeIconOptions(options.icon, own);
  const [ css, rest ] = useSplitCssProps(icon);
  const { isLoading = options.isLoading, noIcon = options.noIcon } = icon;

  if (noIcon) {
    return null;
  }

  if (!data.instance) {
    return <NftEntityBase.Icon { ...props } variant="heading"/>;
  }

  const variant = icon.variant ?? options.variant ?? 'heading';
  const { mr, marginRight, boxSize, ...mediaCss } = css;

  return (
    <NftMedia
      data={ data.instance }
      addressHash={ data.hash }
      isLoading={ isLoading }
      boxSize={ boxSize ?? getVariantPreset(variant).icon.boxSize }
      size="sm"
      allowedTypes={ ICON_MEDIA_TYPES }
      borderRadius="sm"
      flexShrink={ 0 }
      marginRight={ marginRight ?? mr ?? 2 }
      { ...mediaCss }
      className={ rest.className }
      fallback={ <NftEntityBase.Icon { ...props } variant={ variant } marginRight={ 0 }/> }
    />
  );
};

const NftEntity = (props: EntityProps) => {
  return (
    <Container w="100%" { ...props }>
      <Icon/>
      <Link><Content/></Link>
    </Container>
  );
};

Icon.displayName = 'NftEntity.Icon';
NftEntity.displayName = 'NftEntity';

export default React.memo(NftEntity);

export {
  Root,
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
