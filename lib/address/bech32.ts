import { toBech32Address as toBech32AddressCrypto } from '@zilliqa-js/crypto';

import config from 'configs/app';

export function toBech32Address(hash: string) {
  if (!config.UI.views.address.hashFormat.bech32Prefix) {
    return hash;
  }

  return toBech32AddressCrypto(hash).replace('zil', config.UI.views.address.hashFormat.bech32Prefix);
}
