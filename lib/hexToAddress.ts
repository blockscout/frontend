export default function hexToAddress(hex: string) {
  return hex.slice(0, 2) + hex.slice(26);
}
