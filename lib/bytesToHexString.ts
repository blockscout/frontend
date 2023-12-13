export default function bytesToHexString(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}
