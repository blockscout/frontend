// SPDX-License-Identifier: LicenseRef-Blockscout

import type { EntityComponentProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf } from 'src/shared/entities/entity-props';

export interface ValidatorEntityData {
  id: string;
}

export type EntityProps = EntityComponentProps<ValidatorEntityData>;

const ValidatorEntity = defineEntity<ValidatorEntityData>({
  name: 'ValidatorEntity',
  data: keysOf<ValidatorEntityData>()([ 'id' ]),
  singleChain: true,
  route: ({ id }) => ({ pathname: '/validators/[id]', query: { id } }),
  hintPrefix: 'Validator on ',
  icon: 'key',
  text: (data) => data.id,
  copyText: (data) => data.id,
});

export default ValidatorEntity.Entity;

export const { Root, Container, Link, Icon, Content, Copy } = ValidatorEntity;
