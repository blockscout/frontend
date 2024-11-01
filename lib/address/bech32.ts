import { bech32 } from '@scure/base';

import config from 'configs/app';

export const DATA_PART_REGEXP = /^[\da-z]{38}$/;

export function toBech32Address(hash: string) {
  if (config.UI.views.address.hashFormat.bech32Prefix) {
    try {
      const words = bech32.toWords(Buffer.from(hash.replace('0x', ''), 'hex'));
      return bech32.encode(config.UI.views.address.hashFormat.bech32Prefix, words);
    } catch (error) {}
  }

  return hash;
}

export function isBech32Address(hash: string) {
  if (!config.UI.views.address.hashFormat.bech32Prefix) {
    return false;
  }

  if (!hash.startsWith(`${ config.UI.views.address.hashFormat.bech32Prefix }1`)) {
    return false;
  }

  const strippedHash = hash.replace(`${ config.UI.views.address.hashFormat.bech32Prefix }1`, '');
  return DATA_PART_REGEXP.test(strippedHash);
}

export function fromBech32Address(hash: string) {
  if (config.UI.views.address.hashFormat.bech32Prefix) {
    try {
      const { words } = bech32.decode(hash as `${ string }1${ string }`);
      const hex = bech32.fromWords(words);
      return `0x${ Buffer.from(hex).toString('hex') }`;
    } catch (error) {}
  }

  return hash;
}
