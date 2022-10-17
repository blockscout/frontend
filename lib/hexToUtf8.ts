import hexToBytes from 'lib/hexToBytes';

export default function hexToUtf8(hex: string) {
  const utf8decoder = new TextDecoder();
  const bytes = new Uint8Array(hexToBytes(hex));

  return utf8decoder.decode(bytes);
}
