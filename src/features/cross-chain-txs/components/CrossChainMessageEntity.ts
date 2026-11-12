// SPDX-License-Identifier: LicenseRef-Blockscout

import type { EntityComponentProps } from 'src/shared/entities/define-entity';
import { defineEntity } from 'src/shared/entities/define-entity';
import { keysOf } from 'src/shared/entities/entity-props';
import type { Route } from 'src/shared/router/routes';

export interface CrossChainMessageEntityData {
  id: string;
  bridgeId: number | undefined;
}

export type EntityProps = EntityComponentProps<CrossChainMessageEntityData>;

// A message is only addressable within its bridge, so without one there is no route to link to.
const toMessageRoute = ({ id, bridgeId }: CrossChainMessageEntityData): Route | undefined => {
  if (bridgeId === undefined) {
    return;
  }

  return { pathname: '/bridge/[bridgeId]/cross-chain-tx/[id]', query: { bridgeId: String(bridgeId), id } };
};

const CrossChainMessageEntity = defineEntity<CrossChainMessageEntityData>({
  name: 'CrossChainMessageEntity',
  data: keysOf<CrossChainMessageEntityData>()([ 'id', 'bridgeId' ]),
  singleChain: true,
  route: toMessageRoute,
  hintPrefix: 'Cross-chain transaction on ',
  icon: 'interop',
  text: (data) => data.id,
  copyText: (data) => data.id,
  defaults: { noIcon: true, truncation: 'constant' },
});

export default CrossChainMessageEntity.Entity;

export const { Root, Container, Link, Icon, Content, Copy } = CrossChainMessageEntity;
