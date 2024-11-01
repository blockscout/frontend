import { toBech32Address as toBech32AddressCrypto } from '@zilliqa-js/crypto';

export function toBech32Address(hash: string) {
  return toBech32AddressCrypto(hash);
}
