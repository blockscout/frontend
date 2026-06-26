// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { Badge } from 'src/toolkit/chakra/badge';

const ACTOR_TYPES: Record<schemas['FilecoinActorType'], string> = {
  account: 'Account',
  cron: 'Scheduled Tasks',
  datacap: 'Data Cap Management',
  eam: 'Ethereum Address Manager',
  ethaccount: 'Ethereum-Compatible Account',
  evm: 'Ethereum Virtual Machine',
  init: 'Initialization',
  market: 'Storage Market',
  miner: 'Storage Provider',
  multisig: 'Multi-Signature Wallet',
  paych: 'Payment Channel',
  paymentchannel: 'Payment Channel',
  placeholder: 'Placeholder Address',
  power: 'Power Management',
  reward: 'Incentives and Rewards',
  system: 'System Operations',
  verifreg: 'Verification Registry',
};

interface Props {
  actorType: schemas['FilecoinActorType'];
};

const FilecoinActorTag = ({ actorType }: Props) => {
  const text = ACTOR_TYPES[actorType];

  if (!text) {
    return null;
  }

  return <Badge colorPalette="gray">{ text }</Badge>;
};

export default FilecoinActorTag;
