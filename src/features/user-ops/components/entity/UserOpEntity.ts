// SPDX-License-Identifier: LicenseRef-Blockscout

import type { EntityComponentProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf } from 'src/shared/entities/entity-props';

export interface UserOpEntityData {
  hash: string;
}

export type EntityProps = EntityComponentProps<UserOpEntityData>;

const UserOpEntity = defineEntity<UserOpEntityData>({
  name: 'UserOpEntity',
  data: keysOf<UserOpEntityData>()([ 'hash' ]),
  route: ({ hash }) => ({ pathname: '/op/[hash]', query: { hash } }),
  hintPrefix: 'User operation on ',
  icon: 'user_op',
  text: (data) => data.hash,
  copyText: (data) => data.hash,
});

export default UserOpEntity.Entity;

export const { Root, Container, Link, Icon, Content, Copy } = UserOpEntity;
