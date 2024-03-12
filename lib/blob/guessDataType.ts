import filetype from 'magic-bytes.js';

import hexToBytes from 'lib/hexToBytes';

export default function guessDataType(data: string) {
  const bytes = new Uint8Array(hexToBytes(data));

  return filetype(bytes)[0];
}
