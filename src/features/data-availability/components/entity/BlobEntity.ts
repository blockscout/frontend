// SPDX-License-Identifier: LicenseRef-Blockscout

import type { EntityComponentProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf } from 'src/shared/entities/entity-props';

export interface BlobEntityData {
  hash: string;
  text?: string;
}

export type EntityProps = EntityComponentProps<BlobEntityData>;

const BlobEntity = defineEntity<BlobEntityData>({
  name: 'BlobEntity',
  data: keysOf<BlobEntityData>()([ 'hash', 'text' ]),
  route: ({ hash }) => ({ pathname: '/blobs/[hash]', query: { hash } }),
  hintPrefix: 'Blob on ',
  icon: 'blob',
  text: (data) => data.text ?? data.hash,
  copyText: (data) => data.hash,
  defaults: { icon: { borderRadius: 'none' } },
});

export default BlobEntity.Entity;

export const { Root, Container, Link, Icon, Content, Copy } = BlobEntity;
