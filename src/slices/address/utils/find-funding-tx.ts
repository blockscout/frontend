// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

type Tx = schemas['Transaction'];

const isFundingTx = (tx: Tx, addressHash: string): boolean => {
  if (tx.status !== 'ok') {
    return false;
  }

  if (tx.from.hash.toLowerCase() === addressHash.toLowerCase()) {
    return false;
  }

  try {
    return BigInt(tx.value) > BigInt(0);
  } catch {
    return false;
  }
};

export const findFundingTx = (txsOldestFirst: ReadonlyArray<Tx>, addressHash: string): Tx | undefined => {
  return txsOldestFirst.find((tx) => isFundingTx(tx, addressHash));
};
