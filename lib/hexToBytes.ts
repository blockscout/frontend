// hex is `0x{string}`
export default function hexToBytes(hex: string) {
  const bytes = [];
  for (let c = 2; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substring(c, c + 2), 16));
  }
  return bytes;
}
