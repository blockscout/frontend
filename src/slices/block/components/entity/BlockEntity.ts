// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import type { EntityComponentProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf } from 'src/shared/entities/entity-props';

export interface BlockEntityData {
  number: number | string;
  hash?: string;
  isPendingUpdate?: boolean;
}

export type EntityProps = EntityComponentProps<BlockEntityData>;

const PENDING_UPDATE_HINT = 'Block is being re-synced. Details may be incomplete until the update is finished.';

const isPendingUpdate = (data: BlockEntityData): boolean => Boolean(data.isPendingUpdate && config.slices.block.pendingUpdateAlertEnabled);

const BlockEntity = defineEntity<BlockEntityData>({
  name: 'BlockEntity',
  data: keysOf<BlockEntityData>()([ 'number', 'hash', 'isPendingUpdate' ]),
  route: ({ hash, number }) => ({ pathname: '/block/[height_or_hash]', query: { height_or_hash: hash ?? String(number) } }),
  hintPrefix: 'Block on ',
  icon: (data) => isPendingUpdate(data) ? 'status/warning' : 'block',
  hint: (data) => isPendingUpdate(data) ? PENDING_UPDATE_HINT : undefined,
  text: (data) => String(data.number),
  copyText: false,
  defaults: { tailLength: 2 },
});

export default BlockEntity.Entity;

export const { Root, Container, Link, Icon, Content } = BlockEntity;
