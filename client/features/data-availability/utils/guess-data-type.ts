// SPDX-License-Identifier: LicenseRef-Blockscout

import filetype from 'magic-bytes.js';

import hexToBytes from 'client/shared/transformers/hex-to-bytes';

import removeNonSignificantZeroBytes from './remove-non-significant-zero-bytes';

export default function guessDataType(data: string) {
  const bytes = hexToBytes(data);
  const filteredBytes = removeNonSignificantZeroBytes(bytes);

  return filetype(filteredBytes)[0];
}
