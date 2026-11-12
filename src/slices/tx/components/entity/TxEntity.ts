// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import type { EntityComponentProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf } from 'src/shared/entities/entity-props';

export interface TxEntityData {
  hash: string;
  text?: string;
  isPendingUpdate?: boolean;
}

export type EntityProps = EntityComponentProps<TxEntityData>;

const PENDING_UPDATE_HINT = 'This transaction is part of a block that is being re-synced. Details may be incomplete until the update is finished.';

const isPendingUpdate = (data: TxEntityData): boolean => Boolean(data.isPendingUpdate && config.slices.block.pendingUpdateAlertEnabled);

const TxEntity = defineEntity<TxEntityData>({
  name: 'TxEntity',
  data: keysOf<TxEntityData>()([ 'hash', 'text', 'isPendingUpdate' ]),
  route: ({ hash }) => ({ pathname: '/tx/[hash]', query: { hash } }),
  routeTemplate: 'tx',
  hintPrefix: 'Transaction on ',
  icon: (data) => isPendingUpdate(data) ? 'status/warning' : 'transactions',
  hint: (data) => isPendingUpdate(data) ? PENDING_UPDATE_HINT : undefined,
  text: (data) => data.text ?? data.hash,
  copyText: (data) => data.hash,
});

export default TxEntity.Entity;

export const { Root, Container, Link, Icon, Content, Copy } = TxEntity;
