import config from 'configs/app';

const COSMOS_TX_HASH_REGEXP = /^[A-F0-9]{64}$/i;
const COSMOS_ADDRESS_REGEXP = /^cosmos[a-z0-9]{39}$/i;

export type CosmosHashType = 'tx' | 'address' | null;

export function checkCosmosHash(hash: string): CosmosHashType {
  if (config.features.zetachain.isEnabled) {
    if (COSMOS_TX_HASH_REGEXP.test(hash)) {
      return 'tx';
    }

    if (COSMOS_ADDRESS_REGEXP.test(hash)) {
      return 'address';
    }
  }

  return null;
}
