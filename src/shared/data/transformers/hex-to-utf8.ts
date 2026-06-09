// SPDX-License-Identifier: LicenseRef-Blockscout

import hexToBytes from 'src/shared/data/transformers/hex-to-bytes';

export default function hexToUtf8(hex: string) {
  const utf8decoder = new TextDecoder();
  const bytes = hexToBytes(hex);

  return utf8decoder.decode(bytes);
}
