// SPDX-License-Identifier: LicenseRef-Blockscout

import hexToBytes from 'client/shared/transformers/hex-to-bytes';

export default function hexToUtf8(hex: string) {
  const utf8decoder = new TextDecoder();
  const bytes = hexToBytes(hex);

  return utf8decoder.decode(bytes);
}
