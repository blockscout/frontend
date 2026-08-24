// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressNameSource } from 'src/slices/address/utils/get-address-name';
import getAddressName from 'src/slices/address/utils/get-address-name';

import shortenString from 'src/shared/texts/shorten-string';

// What `truncation="constant"` resolves to in `AddressEntity`.
const HASH_CHAR_NUMBER = 8;

// How an address reads on the page, minus the display concerns that need a client: the proxy-implementation
// tooltip and the bech32/Filecoin alt-hash, both driven by user settings unavailable server-side.
export default function addressToPlainText(address: AddressNameSource) {
  return getAddressName(address) ?? shortenString(address.hash, HASH_CHAR_NUMBER);
}
