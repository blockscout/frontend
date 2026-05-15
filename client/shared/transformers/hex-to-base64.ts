// SPDX-License-Identifier: LicenseRef-Blockscout

import bytesToBase64 from './bytes-to-base64';
import hexToBytes from './hex-to-bytes';

export default function hexToBase64(hex: string) {
  const bytes = hexToBytes(hex);

  return bytesToBase64(bytes);
}
