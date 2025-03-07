import { Tag } from '@chakra-ui/react';
import React from 'react';

import type { FilecoinActorType } from 'types/api/addressParams';

const ACTOR_TYPES: Record<FilecoinActorType, string> = {
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
  placeholder: 'Placeholder Address',
  power: 'Power Management',
  reward: 'Incentives and Rewards',
  system: 'System Operations',
  verifreg: 'Verification Registry',
};

type Props = {
  actorType: FilecoinActorType;
};

const FilecoinActorTag = ({ actorType }: Props) => {
  const text = ACTOR_TYPES[actorType];

  if (!text) {
    return null;
  }

  return <Tag colorScheme="gray">{ text }</Tag>;
};

export default FilecoinActorTag;
