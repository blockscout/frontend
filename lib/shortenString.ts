export default function shortenString(string: string | null) {
  if (!string) {
    return '';
  }

  if (string.length <= 7) {
    return string;
  }

  return string.slice(0, 4) + '...' + string.slice(-4);
}
