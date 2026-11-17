// SPDX-License-Identifier: LicenseRef-Blockscout

import { Spinner } from '@chakra-ui/react';
import React from 'react';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import type { EntityComponentProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf } from 'src/shared/entities/entity-props';

export interface TacOperationEntityData {
  id: string;
  status: tac.V2OperationStatus | undefined;
}

export type EntityProps = EntityComponentProps<TacOperationEntityData>;

const TacOperationEntity = defineEntity<TacOperationEntityData>({
  name: 'TacOperationEntity',
  data: keysOf<TacOperationEntityData>()([ 'id', 'status' ]),
  singleChain: true,
  route: ({ id }) => ({ pathname: '/operation/[id]', query: { id } }),
  hintPrefix: 'Operation on ',
  icon: (data) => data.status === tac.V2OperationStatus.pending ? <Spinner size="md" marginRight="8px"/> : 'operation',
  text: (data) => data.id,
  copyText: (data) => data.id,
  defaults: { icon: { borderRadius: 'none' } },
});

export default TacOperationEntity.Entity;

export const { Root, Container, Link, Icon, Content, Copy } = TacOperationEntity;
