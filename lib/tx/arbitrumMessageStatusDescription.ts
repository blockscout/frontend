/* eslint-disable max-len */
import type { ArbitrumMessageStatus } from 'types/api/transaction';

export const MESSAGE_DESCRIPTIONS: Record<ArbitrumMessageStatus, string> = {
  'Syncing with base layer': 'The incoming message was discovered on the rollup, but the corresponding message on L1 has not yet been found',
  'Settlement pending': 'The transaction with the message was included in a rollup block, but there is no batch on L1 containing the block yet',
  'Waiting for confirmation': 'The rollup block with the transaction containing the message was included in a batch on L1, but it is still waiting for the expiration of the fraud proof countdown',
  'Ready for relay': 'The rollup state was confirmed successfully, and the message can be executed—funds can be claimed on L1',
  Relayed: '',
};
