// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressFormat } from 'src/slices/address/types/config';

import { toBech32Address } from 'src/slices/address/utils/bech32';

interface Params {
  readonly hash: string | null | undefined;
  readonly filecoinRobustAddress: string | null | undefined;
  readonly addressFormat: AddressFormat | undefined;
}

export function getDisplayedAddressHash(params: Params & { readonly hash: string }): string;
export function getDisplayedAddressHash(params: Params): string | null | undefined;
export function getDisplayedAddressHash({ hash, filecoinRobustAddress, addressFormat }: Params): string | null | undefined {
  if (filecoinRobustAddress) {
    return filecoinRobustAddress;
  }

  if (addressFormat === 'bech32' && hash) {
    return toBech32Address(hash);
  }

  return hash;
}
