// SPDX-License-Identifier: LicenseRef-Blockscout

import type { EntityComponentProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf } from 'src/shared/entities/entity-props';

export interface FlashblockEntityData {
  number: number;
  index: number;
}

export type EntityProps = EntityComponentProps<FlashblockEntityData>;

const FlashblockEntity = defineEntity<FlashblockEntityData>({
  name: 'FlashblockEntity',
  data: keysOf<FlashblockEntityData>()([ 'number', 'index' ]),
  route: ({ number }) => ({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(number) } }),
  hintPrefix: 'Flashblock on ',
  icon: 'flashblock',
  text: (data) => `${ data.number } #${ data.index }`,
  copyText: false,
  defaults: { truncation: 'none' },
});

export default FlashblockEntity.Entity;

export const { Root, Container, Link, Icon, Content } = FlashblockEntity;
