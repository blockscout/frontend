// SPDX-License-Identifier: LicenseRef-Blockscout

export type AddressFilecoinParams = {
  actor_type?: FilecoinActorType;
  id?: string | null;
  robust?: string | null;
};

export type FilecoinActorType =
  'account' |
  'cron' |
  'datacap' |
  'eam' |
  'ethaccount' |
  'evm' |
  'init' |
  'market' |
  'miner' |
  'multisig' |
  'paych' |
  'placeholder' |
  'power' |
  'reward' |
  'system' |
  'verifreg';
