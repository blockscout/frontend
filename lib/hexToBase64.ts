import hexToBytes from './hexToBytes';

export default function hexToBase64(hex: string) {
  const bytes = new Uint8Array(hexToBytes(hex));

  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  const base64String = btoa(binary);

  return base64String;
}
