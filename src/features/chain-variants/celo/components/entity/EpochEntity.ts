// SPDX-License-Identifier: LicenseRef-Blockscout

import type { EntityComponentProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf } from 'src/shared/entities/entity-props';

export interface EpochEntityData {
  number: string;
}

export type EntityProps = EntityComponentProps<EpochEntityData>;

const EpochEntity = defineEntity<EpochEntityData>({
  name: 'EpochEntity',
  data: keysOf<EpochEntityData>()([ 'number' ]),
  singleChain: true,
  route: ({ number }) => ({ pathname: '/epochs/[number]', query: { number } }),
  hintPrefix: 'Epoch on ',
  icon: 'hourglass',
  text: (data) => data.number,
  copyText: (data) => data.number,
  defaults: { noCopy: true },
});

export default EpochEntity.Entity;

export const { Root, Container, Link, Icon, Content, Copy } = EpochEntity;
